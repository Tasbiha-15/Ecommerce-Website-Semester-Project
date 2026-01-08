"use client"
import { MapPin, Mail, Phone, Send } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 pt-6 pb-24 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Contact Us</h1>
                    <p className="text-slate-500 mt-1 font-light tracking-wide">We are here to assist you with any inquiries.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 h-fit">
                    <div className="space-y-2">
                        <h2 className="text-xl font-serif text-slate-900">Get in Touch</h2>
                        <p className="text-slate-500 text-sm font-light">
                            Visit our flagship store or reach out to our dedicated support team.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-rose-600">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Visit Us</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    24-B, MM Alam Road,<br />
                                    Gulberg III, Lahore,<br />
                                    Pakistan
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-rose-600">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Call Us</h3>
                                <p className="text-slate-600 text-sm">
                                    +92 300 1234567
                                </p>
                                <p className="text-slate-400 text-xs mt-1">Mon-Sat: 10am - 8pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-rose-600">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Email Us</h3>
                                <p className="text-slate-600 text-sm">
                                    care@maryamnmaria.com
                                </p>
                                <p className="text-slate-400 text-xs mt-1">Response within 24 hours</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="space-y-2 mb-8">
                        <h2 className="text-xl font-serif text-slate-900">Send a Message</h2>
                        <p className="text-slate-500 text-sm font-light">
                            Fill out the form below and we will get back to you shortly.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Name</label>
                                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-sm" placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email</label>
                                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-sm" placeholder="Your Email" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Subject</label>
                            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-sm" placeholder="Order Inquiry, General Question..." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Message</label>
                            <textarea rows="5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-sm resize-none" placeholder="How can we help you?"></textarea>
                        </div>

                        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                            Send Message <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
