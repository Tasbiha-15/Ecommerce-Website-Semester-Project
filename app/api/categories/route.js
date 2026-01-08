import { supabase } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, slug')
            .order('name', { ascending: true })

        if (error) throw error

        console.log(`Fetched ${data?.length || 0} categories from database`) // Debug log

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })
    } catch (error) {
        console.error('GET /api/categories Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
