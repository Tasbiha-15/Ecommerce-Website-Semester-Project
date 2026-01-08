export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 pt-6 pb-24 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-widest">Privacy Policy</h1>
                    <p className="text-slate-500 mt-1 font-light tracking-wide text-sm">How we collect, use, and protect your personal data.</p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Section 1 */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-xl font-serif text-slate-900">1. Information We Collect</h2>
                        <p className="text-slate-600 font-light leading-relaxed text-sm">
                            We collect information from you when you register on our site, place an order, subscribe to our newsletter, or fill out a form.
                            When ordering or registering on our site, as appropriate, you may be asked to enter your name, e-mail address, mailing address,
                            phone number, or credit card information. You may, however, visit our site anonymously.
                        </p>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-xl font-serif text-slate-900">2. How We Use Your Information</h2>
                        <p className="text-slate-600 font-light leading-relaxed text-sm mb-4">
                            Any of the information we collect from you may be used in one of the following ways:
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-3">
                            <li className="flex items-start gap-2 text-sm text-slate-600 font-light">
                                <span className="text-rose-600 mt-1">•</span>
                                To personalize your experience and respond to individual needs.
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600 font-light">
                                <span className="text-rose-600 mt-1">•</span>
                                To improve our website offerings based on your feedback.
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600 font-light">
                                <span className="text-rose-600 mt-1">•</span>
                                To improve customer service and support response times.
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600 font-light">
                                <span className="text-rose-600 mt-1">•</span>
                                To process transactions securely and efficiently.
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600 font-light">
                                <span className="text-rose-600 mt-1">•</span>
                                To send periodic emails regarding your order or services.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-xl font-serif text-slate-900">3. Information Protection</h2>
                        <p className="text-slate-600 font-light leading-relaxed text-sm">
                            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter,
                            submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is
                            transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be
                            accessible by those authorized with special access rights to such systems.
                        </p>
                    </div>
                </div>

                {/* Section 4 */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-xl font-serif text-slate-900">4. Cookie Policy</h2>
                        <p className="text-slate-600 font-light leading-relaxed text-sm">
                            Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser
                            (if you allow) that enables the sites or service providers systems to recognize your browser and capture and remember certain information.
                            We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits,
                            and keep track of advertisements.
                        </p>
                    </div>
                </div>

                {/* Section 5 */}
                <div className="p-8 md:p-10 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-xl font-serif text-slate-900">5. Third-Party Disclosure</h2>
                        <p className="text-slate-600 font-light leading-relaxed text-sm">
                            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include
                            trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties
                            agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply
                            with the law, enforce our site policies, or protect ours or others rights, property, or safety.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
