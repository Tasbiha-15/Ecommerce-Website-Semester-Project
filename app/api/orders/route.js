import { createServerClient } from '@supabase/ssr'
import { supabase as supabaseClient } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const body = await request.json()
        const { items, customer_name, email, phone, address, total_amount } = body

        if (!items || !items.length) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 })
        }

        // 0. Get Authenticated User
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        // We don't need to set cookies here for just reading user
                    },
                },
            }
        )
        const { data: { user } } = await supabase.auth.getUser()

        // 1. Upsert Customer
        // Exact keys: full_name, email, phone, address
        const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .upsert({
                full_name: customer_name,
                email: email,
                phone: phone,
                address: address
            }, { onConflict: 'email' })
            .select('id')
            .single()

        if (customerError) {
            console.error("Customer Upsert Error:", customerError)
            throw new Error(`Customer Error: ${customerError.message}`)
        }

        const customerId = customerData.id

        // 2. Create Order
        // Exact keys: customer_id, full_name, email, phone, address, total_amount, status, payment_status, user_id
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: user?.id || null, // Link to auth user if exists
                customer_id: customerId,
                full_name: customer_name,
                email: email,
                phone: phone,
                address: address,
                total_amount,
                status: 'pending'
            }])
            .select()
            .single()

        if (orderError) throw new Error(`Order Error: ${orderError.message}`)

        const orderId = orderData.id
        const orderItems = []
        const transactionLogs = []

        // 3. Process Items
        for (const item of items) {
            const size = item.selectedSize
            const qty = item.quantity

            // A. Check & Deduct Stock from Product Sizes
            if (size) {
                const { data: sizeData, error: sizeError } = await supabase
                    .from('product_sizes')
                    .select('quantity')
                    .eq('product_id', item.id)
                    .eq('size', size)
                    .single()

                if (sizeError || !sizeData) {
                    throw new Error(`Size info not found for ${item.name} (${size})`)
                }

                if (sizeData.quantity < qty) {
                    throw new Error(`Insufficient stock for ${item.name} (Size: ${size})`)
                }

                // Decrement Size Stock
                const { error: updateError } = await supabase
                    .from('product_sizes')
                    .update({ quantity: sizeData.quantity - qty })
                    .eq('product_id', item.id)
                    .eq('size', size)

                if (updateError) throw new Error(`Stock Update Error: ${updateError.message}`)
            }

            // B. Update Main Product Stock (Sync for legacy visibility - now using stock_count)
            const { data: productData } = await supabase
                .from('products')
                .select('stock_count')
                .eq('id', item.id)
                .single()

            if (productData) {
                await supabase
                    .from('products')
                    .update({ stock_count: Math.max(0, (productData.stock_count || 0) - qty) })
                    .eq('id', item.id)
            }

            // C. Prepare Order Item
            // Ensure exact column names: order_id, product_id, size, quantity, price
            const orderItemPayload = {
                order_id: orderId,
                product_id: item.id,
                size: size || 'Standard', // Default to 'Standard' if null to satisfy DB constraint
                quantity: qty,
                price: item.price
            }
            console.log('Pushing order item:', orderItemPayload)
            orderItems.push(orderItemPayload)

            // D. Helper Log
            transactionLogs.push({
                product_id: item.id,
                order_id: orderId,
                type: 'order',
                quantity: qty,
                total_price: item.price * qty,
            })
        }

        // 4. Batch Insert Items
        if (orderItems.length > 0) {
            console.log('Inserting order items batch:', orderItems)
            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)
                .select() // Add select to verify insertion returns data

            if (itemsError) {
                console.error('Order Items Insert Error:', itemsError)
                throw new Error(`Order Items Error: ${itemsError.message}`)
            } else {
                console.log('Order Items Inserted Successfully')
            }
        }

        // 5. Insert Transaction Logs
        if (transactionLogs.length > 0) {
            const { error: txError } = await supabase
                .from('transactions')
                .insert(transactionLogs)
            if (txError) console.error('Transaction log error:', txError)
        }

        return NextResponse.json(orderData)

    } catch (error) {
        console.error('Order processing error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
