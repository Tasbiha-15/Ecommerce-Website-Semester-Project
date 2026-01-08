import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabase = await createClient()
        const logs = []
        const log = (msg) => logs.push(msg)

        log("Starting Backfill Process...")

        // 1. Fetch Reference Data for Validation
        const { data: products } = await supabase.from('products').select('id')
        const { data: orders } = await supabase.from('orders').select('id, created_at')

        const validProductIds = new Set(products?.map(p => p.id) || [])
        const validOrderIds = new Set(orders?.map(o => o.id) || [])
        const orderDateMap = {}
        orders?.forEach(o => orderDateMap[o.id] = o.created_at)

        log(`Loaded ${validProductIds.size} products and ${validOrderIds.size} orders.`)

        // 2. Fetch Order Items
        const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select('*')

        if (itemsError) throw itemsError
        log(`Found ${orderItems?.length || 0} order items.`)

        if (!orderItems?.length) {
            return new NextResponse(`<html><body><h1>Backfill Report</h1><pre>${logs.join('\n')}</pre></body></html>`, { headers: { 'content-type': 'text/html' } })
        }

        // 3. Prepare Transactions
        const { data: existingTransactions } = await supabase.from('transactions').select('order_id, product_id')
        const existingSet = new Set((existingTransactions || []).map(t => `${t.order_id}-${t.product_id}`))

        const toInsert = []
        let skippedFK = 0
        let skippedExist = 0

        for (const item of orderItems) {
            // FK Validation
            if (!validOrderIds.has(item.order_id)) {
                skippedFK++
                continue
            }
            if (!validProductIds.has(item.product_id)) {
                skippedFK++
                continue
            }

            // Existence Check
            const key = `${item.order_id}-${item.product_id}`
            if (existingSet.has(key)) {
                skippedExist++
                continue
            }

            toInsert.push({
                order_id: item.order_id,
                product_id: item.product_id,
                type: 'order',
                quantity: Math.abs(item.quantity || 1),
                total_price: (item.price || 0) * (item.quantity || 1),
                created_at: orderDateMap[item.order_id] || new Date().toISOString()
            })
        }

        log(`Prepared ${toInsert.length} new transactions.`)
        log(`Skipped ${skippedFK} items due to missing Product/Order (FK constraint).`)
        log(`Skipped ${skippedExist} items already in transactions.`)

        // 4. Insert
        if (toInsert.length > 0) {
            const { error: insertError } = await supabase
                .from('transactions')
                .insert(toInsert)

            if (insertError) {
                log(`ERROR INSERTING: ${insertError.message}`)
            } else {
                log("Successfully inserted transactions.")
            }
        } else {
            log("Nothing new to insert.")
        }

        return new NextResponse(`
            <html>
                <body style="font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto;">
                    <h1>Backfill Report</h1>
                    <div style="background: #f4f4f5; padding: 1rem; border-radius: 0.5rem; overflow: auto;">
                        <pre>${logs.join('\n')}</pre>
                    </div>
                    <p>You can now go back to <a href="/admin/transactions">Transactions</a>.</p>
                </body>
            </html>
        `, {
            headers: { 'content-type': 'text/html' }
        })

    } catch (error) {
        return new NextResponse(`<html><body><h1>Error</h1><pre>${error.message}\n${error.stack}</pre></body></html>`, { headers: { 'content-type': 'text/html' } })
    }
}
