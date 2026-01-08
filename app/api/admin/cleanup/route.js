import { supabase } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')

    return NextResponse.json({ data, error })
}
