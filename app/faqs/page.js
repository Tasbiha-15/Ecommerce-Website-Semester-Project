"use client"
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
    {
        question: "What is the delivery Time?",
        answer: "Standard domestic delivery typically takes 3-5 working days. For international orders, delivery times range from 7-14 working days depending on the destination and customs processing."
    },
    {
        question: "What if the product color varies?",
        answer: "We ensure our product photography is as accurate as possible. However, due to studio lighting and differences in screen settings, minor color variations may occur. These nuances are a natural part of the digital shopping experience."
    },
    {
        question: "Can I cancel my order?",
        answer: "Yes, orders can be canceled within 24 hours of placement. After this window, or once the order has been processed for shipping, we are unable to accept cancellations."
    },
    {
        question: "Can I amend my order?",
        answer: "If you need to make changes to your order (such as address or size), please contact our customer support team within 24 hours. We will do our best to accommodate your request before dispatch."
    },
    {
        question: "Can I return the product?",
        answer: "We offer an exchange policy for items returned within 7 days in their original, unused condition with tags attached. We do not offer cash refunds, but we are happy to facilitate an exchange or store credit."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order has been dispatched, you will receive a confirmation email containing your unique tracking number. You can use this link to check the real-time status of your shipment."
    },
    {
        question: "What if my merchandise is damaged?",
        answer: "We conduct strict quality checks before shipping. In the unlikely event that you receive a damaged item, please contact us within 48 hours with photographic evidence, and we will arrange a replacement immediately."
    },
    {
        question: "How shall I make a payment?",
        answer: "We accept a variety of payment methods including major credit/debit cards (Visa, MasterCard) and Bank Transfers. For customers within Pakistan, we also offer Cash on Delivery (COD) services."
    }
]

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null)

    return (
        <div className="container mx-auto px-4 pt-6 pb-24 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Frequently Asked Questions</h1>
                    <p className="text-slate-500 mt-1 font-light tracking-wide">Find answers to common questions about our products and services.</p>
                </div>
            </div>

            {/* Accordion */}
            <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm max-w-4xl mx-auto">
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border border-slate-100 rounded-xl transition-all duration-300 ${openIndex === index ? 'bg-slate-50 border-slate-200' : 'bg-white hover:border-slate-200'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className={`font-serif font-medium transition-colors ${openIndex === index ? 'text-rose-600' : 'text-slate-900'}`}>{faq.question}</span>
                                <div className={`p-1 rounded-full bg-slate-100 transition-colors ${openIndex === index ? 'text-rose-600' : 'text-slate-500'}`}>
                                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </button>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <p className="p-5 pt-0 text-sm text-slate-600 leading-relaxed font-light border-t border-slate-100/50 mt-2">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
