import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit') || 50

        // Debug Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log('API /transactions: User:', user?.id, 'Auth Error:', authError)

        const { data, error } = await supabase
            .from('transactions')
            .select('*, products(name, sku), orders(full_name)')
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('API /transactions: Query Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log('API /transactions: Fetched count:', data?.length)
        return NextResponse.json(data)
    } catch (error) {
        console.error('API /transactions: Catch Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
