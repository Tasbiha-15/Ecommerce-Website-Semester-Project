import { supabase } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Hard Refresh Logic

export async function GET() {
    try {
        // 1. Fetch all products to calculate Inventory Value and Low Stock in memory
        // This is more efficient for consistent stats than multiple queries
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, price, stock_count, low_stock_threshold')

        if (productsError) throw productsError

        const allProducts = products || []
        const productCount = allProducts.length

        // Calculate Inventory Value: Sum(price * stock_count)
        const inventoryValue = allProducts.reduce((acc, curr) => {
            const price = Number(curr.price) || 0
            const stock = Number(curr.stock_count) || 0
            return acc + (price * stock)
        }, 0)

        // Calculate Low Stock Alerts using dynamic threshold
        const lowStockCount = allProducts.filter(p => {
            const stock = Number(p.stock_count) || 0
            const threshold = Number(p.low_stock_threshold) || 10
            return stock <= threshold
        }).length

        // 2. Fetch Recent Orders for Chart (Sales Data)
        const { data: recentOrders } = await supabase
            .from('orders')
            .select('id, created_at, total_amount')
            .order('created_at', { ascending: true })
            .limit(50)

        return NextResponse.json({
            inventoryValue,
            productCount,
            lowStockCount,
            recentOrders
        })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
