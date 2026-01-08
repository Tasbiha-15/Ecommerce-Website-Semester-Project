"use client"
import { useState } from 'react'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'

// Mock Data with Iframe URLs
const STORES = [
    {
        id: 1,
        city: 'Lahore',
        name: 'GULBERG III - MM ALAM ROAD',
        address: '24-B, MM Alam Road, Gulberg III, Lahore',
        phone: '+92 42 3575 1234',
        timings: '11:00 AM - 10:00 PM',
        mapUrl: 'https://maps.google.com/maps?q=24-B,+MM+Alam+Road,+Gulberg+III,+Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed'
    },
    {
        id: 2,
        city: 'Lahore',
        name: 'DHA PHASE 5',
        address: 'Sector C, Phase 5 D.H.A, Lahore',
        phone: '+92 42 3718 5678',
        timings: '11:00 AM - 10:00 PM',
        mapUrl: 'https://maps.google.com/maps?q=Sector+C,+Phase+5+D.H.A,+Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed'
    },
    {
        id: 3,
        city: 'Islamabad',
        name: 'F-7 MARKAZ',
        address: 'Shop 4, Block 13, F-7 Markaz, Islamabad',
        phone: '+92 51 265 9876',
        timings: '11:00 AM - 10:00 PM',
        mapUrl: 'https://maps.google.com/maps?q=F-7+Markaz,+Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed'
    },
    {
        id: 4,
        city: 'Islamabad',
        name: 'CENTAURUS MALL',
        address: 'Ground Floor, Centaurus Mall, Islamabad',
        phone: '+92 51 270 4321',
        timings: '11:00 AM - 11:00 PM',
        mapUrl: 'https://maps.google.com/maps?q=Centaurus+Mall,+Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed'
    }
]

export default function StoreLocatorPage() {
    const [selectedCity, setSelectedCity] = useState('Lahore')
    const [activeStore, setActiveStore] = useState(STORES[0])

    const filteredStores = STORES.filter(store => store.city === selectedCity)

    // Handle City Change - reset active store to first in new city
    const handleCityChange = (city) => {
        setSelectedCity(city)
        const firstStoreInCity = STORES.find(s => s.city === city)
        if (firstStoreInCity) setActiveStore(firstStoreInCity)
    }

    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col md:flex-row bg-white animate-in fade-in duration-500">

            {/* LEFT PANEL - Scrollable List (35%) */}
            <div className="w-full md:w-[35%] h-full flex flex-col border-r border-slate-100 bg-white z-10 shadow-xl md:shadow-none">

                {/* Header & Filter */}
                <div className="p-6 bg-white/95 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-20">
                    <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6 uppercase tracking-widest">Store Locator</h1>

                    {/* City Filter Toggle */}
                    <div className="inline-flex bg-slate-100 p-1 rounded-lg w-full">
                        {['Lahore', 'Islamabad'].map((city) => (
                            <button
                                key={city}
                                onClick={() => handleCityChange(city)}
                                className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all duration-300 ${selectedCity === city
                                        ? 'bg-white text-rose-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Store List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredStores.map((store) => (
                        <div
                            key={store.id}
                            onClick={() => setActiveStore(store)}
                            className={`p-8 border-b border-gray-100 transition-colors cursor-pointer group ${activeStore.id === store.id ? 'bg-slate-50 border-l-4 border-l-rose-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                                }`}
                        >
                            <h3 className={`text-lg font-serif font-bold mb-4 ${activeStore.id === store.id ? 'text-rose-600' : 'text-slate-900'
                                }`}>{store.name}</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                                    <p className="text-sm text-slate-600 font-light leading-relaxed">{store.address}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                    <p className="text-sm text-slate-600 font-light">{store.phone}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                    <p className="text-sm text-slate-600 font-light">{store.timings}</p>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-rose-600 transition-colors">
                                <Navigation className="w-3 h-3" />
                                View on Map
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PANEL - Map Iframe (65%) */}
            <div className="w-full md:w-[65%] h-full bg-slate-50 relative">
                <iframe
                    key={activeStore.id}
                    title={activeStore.name}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={activeStore.mapUrl}
                    className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                >
                </iframe>

                {/* Loading State / Overlay */}
                <div className="absolute top-0 right-0 p-6 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-xl shadow-lg border border-slate-100">
                        <h3 className="font-serif font-bold text-slate-900 text-sm">{activeStore.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">Now Viewing Location</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
