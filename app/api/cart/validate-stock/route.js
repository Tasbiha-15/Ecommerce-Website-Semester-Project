import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
    try {
        const { items } = await request.json()
        // items = [{ id, size, quantity }, ...]

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid request format' }, { status: 400 })
        }

        const validationResults = []

        for (const item of items) {
            const { id: productId, size, quantity } = item

            if (!productId || !size || !quantity) {
                validationResults.push({
                    id: productId,
                    size,
                    requestedQty: quantity,
                    availableStock: 0,
                    valid: false,
                    error: 'Missing required fields'
                })
                continue
            }

            // Query product_sizes table for this specific product_id and size
            const { data, error } = await supabase
                .from('product_sizes')
                .select('quantity')
                .eq('product_id', productId)
                .eq('size', size)
                .single()

            if (error || !data) {
                validationResults.push({
                    id: productId,
                    size,
                    requestedQty: quantity,
                    availableStock: 0,
                    valid: false,
                    error: 'Size not found or out of stock'
                })
                continue
            }

            const availableStock = data.quantity || 0
            const valid = quantity <= availableStock

            validationResults.push({
                id: productId,
                size,
                requestedQty: quantity,
                availableStock,
                valid
            })
        }

        const allValid = validationResults.every(r => r.valid)

        return NextResponse.json({
            valid: allValid,
            items: validationResults
        })

    } catch (error) {
        console.error('Stock validation error:', error)
        return NextResponse.json({ error: 'Failed to validate stock' }, { status: 500 })
    }
}
