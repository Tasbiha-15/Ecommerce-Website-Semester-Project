import { MapPin, Mail, Phone, ArrowRight, Instagram } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 pt-6 pb-24 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">About Maryum & Maria</h1>
                    <p className="text-slate-500 mt-1 font-light tracking-wide">Experience the legacy of timeless elegance.</p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white p-8 lg:p-12 rounded-2xl border border-slate-100 shadow-sm space-y-12">

                {/* Brand Story */}
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <h2 className="text-2xl font-serif text-slate-900">Our Heritage</h2>
                    <p className="text-slate-600 leading-loose font-light">
                        Founded on the principles of exquisite craftsmanship and modern sophistication, Maryum & Maria has established itself as a beacon of luxury fashion.
                        From our humble beginnings in Lahore to becoming a global name, our journey has been defined by an unwavering commitment to quality.
                    </p>
                    <p className="text-slate-600 leading-loose font-light">
                        Every piece in our collection is a testament to the artistry of our skilled artisans, who blend traditional techniques with contemporary aesthetics
                        to create garments that are not just clothes, but heirlooms.
                    </p>
                </div>





                {/* Values Grid */}
                <div className="bg-slate-200 rounded-2xl p-8 md:p-12 border border-slate-100/50">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto text-rose-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            </div>
                            <h3 className="font-serif text-lg text-slate-900">Excellence</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">We settle for nothing less than perfection in every stitch and seam.</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto text-rose-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="font-serif text-lg text-slate-900">Timelessness</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">Designs that transcend trends and remain eternally stylish.</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto text-rose-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </div>
                            <h3 className="font-serif text-lg text-slate-900">Passion</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">Driven by a love for fashion and a dedication to our customers.</p>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-50 space-y-6">
                    <h2 className="text-2xl font-serif text-slate-900 text-center">Have questions about our collections?</h2>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-rose-600 transition-colors shadow-lg shadow-slate-200">
                        Get In Touch <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

            </div>
        </div>
    )
}
