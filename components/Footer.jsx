"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, ArrowRight, CreditCard, Heart } from 'lucide-react'

export default function Footer() {
    const pathname = usePathname()
    // Ensure hooks are called before return

    if (pathname?.startsWith('/admin')) return null

    return (
        <footer className="bg-white text-slate-900 border-t border-gray-200 pt-16 pb-8 mt-auto font-sans">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Get In Touch */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-serif font-bold tracking-wide uppercase">Get In Touch</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Sign up for our newsletter to receive exclusive offers and latest news.
                        </p>
                        <div className="flex w-full border-b border-slate-300 pb-1">
                            <input
                                type="email"
                                placeholder="Enter Your Email"
                                className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400 py-2"
                            />
                            <button className="text-slate-900 hover:text-slate-600 transition-colors">
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors"><Youtube className="h-5 w-5" /></a>
                            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors"><Twitter className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Column 2: Customer Care */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-serif font-bold tracking-wide uppercase">Customer Care</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping-policy" className="hover:text-slate-900 transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/returns" className="hover:text-slate-900 transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/faqs" className="hover:text-slate-900 transition-colors">FAQ's</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Information */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-serif font-bold tracking-wide uppercase">Information</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link href="/about" className="hover:text-slate-900 transition-colors">About Us</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/store-locator" className="hover:text-slate-900 transition-colors">Store Locator</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-serif font-bold tracking-wide uppercase">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-slate-600">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-slate-900 shrink-0 mt-0.5" />
                                <span>24-B, MM Alam Road,<br />Gulberg III, Lahore,<br />Pakistan</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-slate-900 shrink-0" />
                                <span>+92 300 1234567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-slate-900 shrink-0" />
                                <span>care@maryamnmaria.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8 flex flex-col items-center justify-between gap-6 text-sm text-slate-500">
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-between">
                        <p>© 2025 Maryam & Maria. All Rights Reserved.</p>

                        {/* Centered Credit */}
                        <div className="flex items-center gap-2 group cursor-default">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Built with</span>
                            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse group-hover:scale-125 transition-transform" />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-800">by Tasbiha</span>
                        </div>

                        {/* Payment Icons */}
                        <div className="flex items-center gap-3 opacity-70 grayscale hover:grayscale-0 transition-all">
                            <div className="border border-gray-300 rounded px-2 py-1"><span className="font-bold text-[10px] italic">VISA</span></div>
                            <div className="border border-gray-300 rounded px-2 py-1"><span className="font-bold text-[10px]">MC</span></div>
                            <div className="border border-gray-300 rounded px-2 py-1"><span className="font-bold text-[10px]">AMEX</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
