"use client"
import Link from 'next/link'
import { RotateCcw, ShieldCheck, AlertCircle, RefreshCw, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ReturnsPolicy() {
    return (
        <div className="container mx-auto px-4 pt-6 pb-24 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Return & Exchange Policy</h1>
                    <p className="text-slate-500 mt-1 font-light tracking-wide">We want you to love your purchase.</p>
                </div>
            </div>

            {/* Policy Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Returns */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <RotateCcw className="h-6 w-6 text-rose-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Returns Window</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        You have <span className="font-bold text-slate-900">7 days</span> from the date of delivery to initiate a return.
                    </p>
                    <p className="text-sm text-slate-500">
                        We believe this gives you ample time to try on your purchase in the comfort of your home.
                    </p>
                </div>

                {/* Conditions */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Item Conditions</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        To be eligible for a return, your item must be strictly:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                        <li>Unworn and unwashed</li>
                        <li>In original condition</li>
                        <li>With all original tags and packaging attached</li>
                    </ul>
                </div>

                {/* Exchanges */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <RefreshCw className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Exchanges</h3>
                    <p className="text-slate-600 leading-relaxed">
                        We currently offer direct exchanges only if:
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600 list-disc list-inside">
                        <li>The product arrived damaged or defective</li>
                        <li>You received the wrong size or item</li>
                    </ul>
                </div>

                {/* Refunds */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <CreditCardIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Refunds</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Once your return is received and inspected, we will notify you of the approval or rejection of your refund.
                    </p>
                    <p className="text-sm text-slate-500 mt-4">
                        Approved refunds are processed back to your <span className="font-bold text-slate-900">original payment method</span> or issued as store credit.
                    </p>
                </div>
            </div>

            {/* Contact / Start Return */}
            <div className="bg-slate-900 text-white p-12 rounded-2xl shadow-xl text-center space-y-8">
                <div className="max-w-3xl mx-auto space-y-4">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold">How to Start a Return</h2>
                    <p className="text-slate-300 text-lg">
                        Ready to make a return? Contact our support team to get started. Please include your Order ID in the subject line.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-4">
                    <div className="text-center md:text-left bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Email Us At</p>
                        <a href="mailto:returns@maryamnmaria.com" className="text-xl font-bold hover:text-rose-400 transition-colors flex items-center gap-3">
                            <Mail className="h-5 w-5" /> returns@maryamnmaria.com
                        </a>
                    </div>
                    <Link href="/contact">
                        <Button className="h-14 px-10 bg-white text-slate-900 hover:bg-rose-50 font-bold uppercase tracking-widest rounded-full shadow-lg hover:shadow-xl transition-all">
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

function CreditCardIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
    )
}
