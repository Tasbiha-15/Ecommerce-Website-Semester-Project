"use client"
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CheckoutSuccess() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-emerald-50 p-6 rounded-full mb-6">
                <CheckCircle className="h-16 w-16 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-500 max-w-md mb-8">
                Thank you for your purchase. We have received your order and are getting it ready!
            </p>
            <div className="flex gap-4">
                <Link href="/">
                    <Button className="bg-slate-900 text-white hover:bg-slate-800">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    )
}
