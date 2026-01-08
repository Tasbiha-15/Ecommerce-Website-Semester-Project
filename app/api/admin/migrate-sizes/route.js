import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabase = await createClient()

        // 1. Fetch all products
        const { data: products, error: fetchError } = await supabase
            .from('products')
            .select('id, stock_count')

        if (fetchError) throw fetchError

        if (!products || products.length === 0) {
            return NextResponse.json({ message: 'No products to migrate' })
        }

        const results = []

        // 2. Loop and Insert Size 'M'
        for (const product of products) {
            // Check if size entries already exist to avoid overwriting/duplicating if run twice
            const { data: existing } = await supabase
                .from('product_sizes')
                .select('id')
                .eq('product_id', product.id)
                .maybeSingle()

            if (!existing) {
                // Insert 'M' with current stock
                const { error: insertError } = await supabase
                    .from('product_sizes')
                    .insert([
                        { product_id: product.id, size: 'XS', quantity: 0 },
                        { product_id: product.id, size: 'S', quantity: 0 },
                        { product_id: product.id, size: 'M', quantity: product.stock_count || 0 }, // Migrate stock here
                        { product_id: product.id, size: 'L', quantity: 0 },
                        { product_id: product.id, size: 'XL', quantity: 0 },
                    ])

                if (insertError) {
                    console.error(`Failed to migrate product ${product.id}`, insertError)
                    results.push({ id: product.id, status: 'failed', error: insertError.message })
                } else {
                    results.push({ id: product.id, status: 'migrated', stock: product.stock_count })
                }
            } else {
                results.push({ id: product.id, status: 'skipped (already exists)' })
            }
        }

        return NextResponse.json({
            message: 'Migration process completed',
            total_products: products.length,
            results
        })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
