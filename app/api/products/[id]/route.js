import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request, context) {
    const supabase = await createClient()
    const { id } = await context.params

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            product_sizes (
                size,
                quantity
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Transform product_sizes into a cleaner object { S: 5, M: 10, ... }
    const sizeMap = {}
    if (product.product_sizes && Array.isArray(product.product_sizes)) {
        product.product_sizes.forEach(item => {
            sizeMap[item.size] = item.quantity
        })
    }

    return NextResponse.json({ ...product, sizes: sizeMap })
}

export async function PUT(request, context) {
    try {
        const supabase = await createClient()
        const { id } = await context.params
        const body = await request.json()

        console.log('PUT /api/products/[id] - ID:', id)
        console.log('PUT Body:', JSON.stringify(body, null, 2))

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        // Extract only valid fields to update (remove runtime fields and deleted columns)
        const {
            id: _id,
            created_at: _created,
            low_stock: _low,
            currency: _curr,
            stock: _stock,  // Exclude legacy stock column
            image: _image,  // Exclude deleted image column
            product_sizes: _ps, // Exclude nested relation data
            sizes,
            ...updateData
        } = body

        // Debug: Log what we're about to update
        console.log('Fields being updated:', Object.keys(updateData))
        console.log('UpdateData:', JSON.stringify(updateData, null, 2))

        // If sizes are provided, update them and calculate total stock
        let newTotalStock = null
        if (sizes && typeof sizes === 'object') {
            const sizeUpserts = Object.entries(sizes).map(([size, quantity]) => ({
                product_id: id,
                size,
                quantity: Number(quantity) || 0
            }))

            if (sizeUpserts.length > 0) {
                // Upsert sizes
                const { error: sizeError } = await supabase
                    .from('product_sizes')
                    .upsert(sizeUpserts, { onConflict: 'product_id, size' })

                if (sizeError) {
                    console.error('Error upserting sizes:', sizeError)
                    throw sizeError
                }

                // Calculate total for stock_count and update main product
                newTotalStock = sizeUpserts.reduce((sum, item) => sum + item.quantity, 0)
                updateData.stock_count = newTotalStock
                // Legacy stock column is ignored/not updated as per user request to avoid double data
            }
        }

        const { data, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()

        if (error) {
            console.error('Supabase Update Error - Full Details:')
            console.error('Error Message:', error.message)
            console.error('Error Code:', error.code)
            console.error('Error Hint:', error.hint)
            console.error('Error Details:', error.details)
            console.error('Full Error Object:', JSON.stringify(error, null, 2))
            return NextResponse.json({
                error: error.message,
                code: error.code,
                hint: error.hint,
                details: error.details
            }, { status: 500 })
        }

        if (!data || data.length === 0) {
            console.error('Supabase Update: No data returned. ID might not exist or RLS policy failed.')
            // Check current user for debugging
            const { data: { user } } = await supabase.auth.getUser()
            console.log('Current Auth User:', user?.email || 'No User Found')
            return NextResponse.json({ error: 'Product not found or update failed (RLS denied)' }, { status: 404 })
        }

        console.log('Product updated successfully:', data[0])
        return NextResponse.json(data[0])
    } catch (error) {
        console.error('PUT /api/products/[id] Critical Error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(request, context) {
    const supabase = await createClient()
    const { id } = await context.params

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ message: 'Deleted' })
}
