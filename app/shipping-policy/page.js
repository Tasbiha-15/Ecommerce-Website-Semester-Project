import { Truck, Globe, Package, FileText, Clock, MapPin } from 'lucide-react'

export default function ShippingPage() {
    return (
        <div className="container mx-auto px-4 pt-6 pb-24 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-widest">Shipping Policy</h1>
                    <p className="text-slate-500 mt-1 font-light tracking-wide text-sm">Delivery timelines, costs, and international shipping information.</p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Domestic Shipping */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-6">
                        <div className="p-3 bg-rose-50 rounded-xl text-rose-600 shrink-0">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div className="space-y-4 w-full">
                            <h2 className="text-xl font-serif text-slate-900">Domestic Shipping (Pakistan)</h2>
                            <p className="text-slate-600 font-light leading-relaxed text-sm">
                                We offer reliable nationwide shipping. A flat rate of PKR 250 applies to all orders under PKR 15,000. Orders above PKR 15,000 qualify for complimentary shipping.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-3 text-sm text-slate-700 bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">Standard Delivery: 3-5 Working Days</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700 bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">Nationwide Coverage</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* International Shipping */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-6">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div className="space-y-4 w-full">
                            <h2 className="text-xl font-serif text-slate-900">International Shipping</h2>
                            <p className="text-slate-600 font-light leading-relaxed text-sm">
                                We ship our collections globally to fashion enthusiasts around the world. Shipping costs are calculated at checkout based on the weight of your order and the destination country.
                            </p>
                            <div className="flex items-center gap-3 text-sm text-slate-700 bg-white border border-slate-100 p-3 rounded-lg shadow-sm w-fit">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="font-medium">International Delivery: 7-14 Working Days</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Tracking */}
                <div className="p-8 md:p-10 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-6">
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                            <Package className="w-6 h-6" />
                        </div>
                        <div className="space-y-4 w-full">
                            <h2 className="text-xl font-serif text-slate-900">Order Tracking</h2>
                            <p className="text-slate-600 font-light leading-relaxed text-sm">
                                Once your order has been dispatched, you will receive a confirmation email containing your unique tracking number and a link to monitor your shipment's journey.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Customs & Duties */}
                <div className="p-8 md:p-10 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-6">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shrink-0">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="space-y-4 w-full">
                            <h2 className="text-xl font-serif text-slate-900">Customs & Duties</h2>
                            <p className="text-slate-600 font-light leading-relaxed text-sm">
                                For international orders, please be aware that customs duties and taxes may be levied by your country's customs department. These charges are the sole responsibility of the customer and are not included in the shipping costs calculated at checkout.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
