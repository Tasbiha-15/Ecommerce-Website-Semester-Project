
import { Suspense } from 'react'
import ProductClient from './ProductClient'
import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminProductsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-500" /></div>}>
            <ProductClient />
        </Suspense>
    )
}
