import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Hard Refresh Logic

export async function GET() {
    const supabase = await createClient()

    // Fetch all products with sizes
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            product_sizes (
                size,
                quantity
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data to match frontend requirements
    const transformedProducts = products.map(product => {
        // Transform product_sizes into a cleaner object { S: 5, M: 10, ... }
        const sizeMap = {}
        if (product.product_sizes && Array.isArray(product.product_sizes)) {
            product.product_sizes.forEach(item => {
                sizeMap[item.size] = item.quantity
            })
        }

        return {
            ...product,
            // Ensure numeric fields are numbers
            price: Number(product.price),
            // Standardize currency field
            currency: 'PKR',
            // Calculate dynamic total stock from sizes
            stock: Object.values(sizeMap).reduce((a, b) => a + b, 0),
            stock_count: Object.values(sizeMap).reduce((a, b) => a + b, 0),
            // Low Stock Logic: True if stock <= threshold (default 10)
            low_stock: (Number(product.stock_count !== undefined ? product.stock_count : (product.stock || 0)) <= (Number(product.low_stock_threshold) || 10)),
            // Ensure arrays are arrays
            images: Array.isArray(product.images) ? product.images : [],
            available_sizes: Array.isArray(product.available_sizes) ? product.available_sizes : ['XS', 'S', 'M', 'L', 'XL'],
            // Map the fetched sizes
            sizes: sizeMap,
            // Standardize currency field
            currency: 'PKR'
        }
    })

    return NextResponse.json(transformedProducts)
}

export async function POST(request) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        console.log('POST /api/products - Received body:', body) // Debug log

        if (!body.name || !body.price || !body.sku || !body.category_id) {
            return NextResponse.json({ error: 'Missing required fields (Name, Price, SKU, Category)' }, { status: 400 })
        }

        // Ensure defaults for new fields if not provided
        if (!body.stock_count && body.stock_count !== 0) body.stock_count = 0
        if (!body.available_sizes) body.available_sizes = ['XS', 'S', 'M', 'L', 'XL']
        if (!body.images) body.images = []

        // Calculate total stock from sizes if provided
        let initialSizes = []
        if (body.sizes && typeof body.sizes === 'object') {
            initialSizes = Object.entries(body.sizes).map(([size, qty]) => ({
                size,
                quantity: Number(qty) || 0
            }))
            // Override stock_count with sum of sizes
            const totalStock = initialSizes.reduce((acc, curr) => acc + curr.quantity, 0)
            body.stock_count = totalStock
            delete body.stock // Ensure we don't write to legacy stock column
            delete body.image // Exclude deleted image column
            delete body.images // Exclude deleted images column
        }

        const { data, error } = await supabase
            .from('products')
            .insert([body])
            .select()

        if (error) {
            console.error('Supabase Insert Error:', error) // Debug log
            throw error
        }

        const newProduct = data[0]

        // Insert sizes if present
        if (initialSizes.length > 0) {
            const sizeInserts = initialSizes.map(s => ({
                product_id: newProduct.id,
                size: s.size,
                quantity: s.quantity
            }))

            const { error: sizeError } = await supabase
                .from('product_sizes')
                .insert(sizeInserts)

            if (sizeError) console.error('Error inserting initial sizes:', sizeError)
        }

        console.log('Product created successfully:', newProduct) // Debug log
        return NextResponse.json(newProduct)
    } catch (error) {
        console.error('POST /api/products Error:', error) // Debug log
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE and PUT moved to [id]/route.js
