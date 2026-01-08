export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 pt-6 pb-24 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-widest">Terms of Service</h1>
                    <p className="text-slate-500 mt-1 font-light tracking-wide text-sm">Please read these terms carefully before using our services.</p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Section 1 */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-xl font-serif text-slate-900">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 font-light leading-relaxed text-sm">
                            By accessing and placing an order with Maryum & Maria, you confirm that you are in agreement with and bound by the terms of service
                            contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication
                            between you and Maryum & Maria.
                        </p>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-xl font-serif text-slate-900">2. Products & Colors</h2>
                        <p className="text-slate-600 font-light leading-relaxed text-sm">
                            We have made every effort to display as accurately as possible the colors and images of our products that appear at the store.
                            We cannot guarantee that your computer monitor's display of any color will be accurate. All products are subject to availability
                            and we reserve the right to impose quantity limits on any order, to reject all or part of an order, and to discontinue products
                            without notice, even if you have already placed your order.
                        </p>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-xl font-serif text-slate-900">3. Pricing & Payments</h2>
                        <p className="text-slate-600 font-light leading-relaxed text-sm">
                            All prices are listed in Pakistani Rupees (PKR) and are inclusive of applicable taxes unless otherwise stated. We reserve the
                            right to verify the identity of the credit card holder by requesting appropriate documentation. Failure to provide such
                            documentation may result in the cancellation of your order.
                        </p>
                    </div>
                </div>

                {/* Section 4 */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-xl font-serif text-slate-900">4. Shipping & Delivery</h2>
                        <p className="text-slate-600 font-light leading-relaxed text-sm">
                            Delivery times are estimates and start from the date of shipping. We shall not be responsible for any delays caused by
                            destination customs clearance processes or other unforeseen circumstances.
                        </p>
                    </div>
                </div>

                {/* Section 5 */}
                <div className="p-8 md:p-10 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-4">
                        <h2 className="text-xl font-serif text-slate-900">5. Intellectual Property</h2>
                        <p className="text-slate-600 font-light leading-relaxed text-sm">
                            The website and its entire contents, features, and functionality (including but not limited to all information, software,
                            text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Maryum & Maria,
                            its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret,
                            and other intellectual property or proprietary rights laws.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
