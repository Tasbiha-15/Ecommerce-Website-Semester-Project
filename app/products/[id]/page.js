"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star, MapPin, Truck, ShieldCheck, Ruler, Banknote, CreditCard } from 'lucide-react'
import { useCart } from '@/context/CartContext'

// --- Helper Components ---

const AccordionItem = ({ title, isOpen, onClick, children }) => {
    return (
        <div className="border-b border-gray-100">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between py-4 text-left group"
            >
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-slate-600 transition-colors">
                    {title}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 text-sm text-slate-500 leading-relaxed font-light">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const SizeSelector = ({ selectedSize, onSelect, productSizes }) => {
    const sizes = ['XS', 'S', 'M', 'L', 'XL']

    // Helper to check stock
    const isAvailable = (size) => {
        // Strict check: if sizes object exists, check it.
        // If no size data exists (legacy), treat as unavailable to prevent over-ordering?
        // Or assume available. Given migration, let's assume if productSizes is missing/empty, we can't be sure
        // BUT the API now guarantees 'sizes' map.
        if (!productSizes) return false // Safer default
        return (productSizes[size] || 0) > 0
    }

    return (
        <div className="flex items-center gap-3">
            {sizes.map((size) => {
                const available = isAvailable(size)
                return (
                    <button
                        key={size}
                        onClick={() => available && onSelect(size)}
                        disabled={!available}
                        title={!available ? "Out of Stock" : ""}
                        className={`
                            w-10 h-10 flex items-center justify-center text-xs font-bold transition-all duration-200 relative
                            ${selectedSize === size
                                ? 'bg-slate-900 text-white border-slate-900'
                                : available
                                    ? 'bg-white text-slate-500 border border-slate-200 hover:border-slate-900 hover:text-slate-900'
                                    : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed Decoration-slate-300'}
                        `}
                    >
                        {size}
                        {!available && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[120%] h-[1px] bg-slate-300 rotate-45" />
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

const SizeGuideModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
                {/* Header */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-serif text-slate-900 tracking-tight">Size Guide</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">Ladies Dresses</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                        Use this chart to find your perfect fit. Measurements are in <span className="font-bold text-slate-900">inches</span>.
                    </p>

                    <div className="overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-slate-900 text-white">
                                <tr>
                                    <th className="py-3 px-4 font-bold uppercase tracking-widest text-[10px]">Size</th>
                                    <th className="py-3 px-4 font-bold uppercase tracking-widest text-[10px]">Bust</th>
                                    <th className="py-3 px-4 font-bold uppercase tracking-widest text-[10px]">Waist</th>
                                    <th className="py-3 px-4 font-bold uppercase tracking-widest text-[10px]">Hips</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-slate-900">XS</td>
                                    <td className="py-3 px-4 text-slate-600">32</td>
                                    <td className="py-3 px-4 text-slate-600">24</td>
                                    <td className="py-3 px-4 text-slate-600">34</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-slate-900">S</td>
                                    <td className="py-3 px-4 text-slate-600">34</td>
                                    <td className="py-3 px-4 text-slate-600">26</td>
                                    <td className="py-3 px-4 text-slate-600">36</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-slate-900">M</td>
                                    <td className="py-3 px-4 text-slate-600">36</td>
                                    <td className="py-3 px-4 text-slate-600">28</td>
                                    <td className="py-3 px-4 text-slate-600">38</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-slate-900">L</td>
                                    <td className="py-3 px-4 text-slate-600">38</td>
                                    <td className="py-3 px-4 text-slate-600">30</td>
                                    <td className="py-3 px-4 text-slate-600">40</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-slate-900">XL</td>
                                    <td className="py-3 px-4 text-slate-600">40</td>
                                    <td className="py-3 px-4 text-slate-600">32</td>
                                    <td className="py-3 px-4 text-slate-600">42</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2">How to Measure</h4>
                        <ul className="space-y-2 text-xs text-slate-500">
                            <li className="flex gap-2">
                                <span className="font-bold text-slate-900">Bust:</span> Measure around the fullest part.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-slate-900">Waist:</span> Measure around natural waistline.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-slate-900">Hips:</span> Measure 20cm down from waistline.
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default function ProductDetails() {
    const params = useParams()
    const id = params?.id
    const { addToCart, cart } = useCart()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    const [selectedSize, setSelectedSize] = useState(null) // User must select size
    const [paymentMethod, setPaymentMethod] = useState('cod') // 'cod' or 'online'
    const [openAccordion, setOpenAccordion] = useState('details') // 'details', 'fabric', 'shipping'
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)

    // Zoom state
    const [isZoomed, setIsZoomed] = useState(false)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return
            try {
                // Try fetching from real API first
                const res = await fetch('/api/products')
                const data = await res.json()

                let foundProduct
                if (Array.isArray(data)) {
                    // Try to find by ID first, then fallback to array index if testing with mock IDs
                    foundProduct = data.find(p => p.id === id) || data.find(p => String(p.id) === String(id))
                }

                // If not found in API (or API fails), fallback to Mock data for reliability during demo
                if (!foundProduct) {
                    // Using the mock data from original file as fallback if API doesn't return the specific ID
                    // This ensures the page doesn't break if the user navigates from a mock card
                    const MOCK_PRODUCTS = {
                        '1': { id: '1', name: 'Wireless Headset', price: 99.99, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', category: 'Audio', stock: 12, description: 'Experience crystal clear audio with our premium wireless headset. Features active noise cancellation and 30-hour battery life.' },
                        '2': { id: '2', name: 'Mechanical Keyboard', price: 149.50, image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80', category: 'Electronics', stock: 5, description: 'Tactile switches and RGB lighting make this the ultimate keyboard for gamers and professionals alike.' },
                        '3': { id: '3', name: 'Gaming Mouse', price: 59.99, image_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80', category: 'Electronics', stock: 0, description: 'Precision sensor and ergonomic design for hours of comfortable gameplay.' },
                        '4': { id: '4', name: 'USB-C Cable', price: 12.99, image_url: 'https://images.unsplash.com/photo-1542382256769-2570636a8c76?w=800&q=80', category: 'Accessories', stock: 50, description: 'Durable braided cable for fast charging and data transfer.' },
                        '5': { id: '5', name: 'Laptop Stand', price: 39.99, image_url: 'https://images.unsplash.com/photo-1527866959252-de385d564fa0?w=800&q=80', category: 'Accessories', stock: 20, description: 'Ergonomic aluminum stand to improve your posture and desk organization.' },
                        '6': { id: '6', name: 'Smart Watch', price: 199.00, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', category: 'Wearables', stock: 8, description: 'Track your fitness and stay connected with notifications on your wrist.' },
                    }
                    foundProduct = MOCK_PRODUCTS[id]
                }

                setProduct(foundProduct)
            } catch (e) {
                console.error("Failed to load product", e)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setCursorPos({ x, y })
    }





    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-4"></div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400">Loading Product...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <p className="text-xl font-serif text-slate-900 mb-4">Product Not Found</p>
                <Link href="/" className="text-xs uppercase tracking-widest border-b border-slate-300 pb-1 hover:border-slate-900 transition-colors">
                    Return Home
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Size Guide Modal */}
            <AnimatePresence>
                {isSizeGuideOpen && <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />}
            </AnimatePresence>

            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">

                    {/* --- LEFT: Image Gallery --- */}
                    <div className="relative">
                        {/* Mobile Back Button */}
                        <Link href="/" className="inline-flex lg:hidden items-center text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-slate-900 transition-colors mb-6">
                            ← Back to Collection
                        </Link>

                        <div className="relative w-full max-h-[500px] lg:max-h-[600px] bg-gray-50/50 rounded-lg overflow-hidden group">
                            <div
                                className="w-full h-full cursor-zoom-in"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                {/* Main Image */}
                                <div className="w-full h-[500px] lg:h-[600px] flex items-center justify-center p-8">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-contain transition-transform duration-500"
                                        style={{
                                            transformOrigin: `${cursorPos.x}% ${cursorPos.y}%`,
                                            transform: isZoomed ? 'scale(1.5)' : 'scale(1)'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT: Product Details --- */}
                    <div className="flex flex-col">

                        {/* Breadcrumbs / Back */}
                        <Link href="/" className="hidden lg:inline-flex items-center text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-slate-900 transition-colors mb-10 w-fit">
                            ← Back to Collection
                        </Link>

                        {/* Header Info */}
                        <div className="mb-8">
                            {product.category && (
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-rose-500 mb-2 block">
                                    {typeof product.category === 'object' ? product.category.name : product.category}
                                </span>
                            )}
                            <h1 className="text-3xl lg:text-5xl font-serif text-slate-900 mb-4 tracking-tight leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <p className="text-xl font-medium text-slate-900">
                                    PKR {Number(product.price).toLocaleString()}
                                </p>

                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Select Size</label>
                                <button
                                    onClick={() => setIsSizeGuideOpen(true)}
                                    className="text-[10px] uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1"
                                >
                                    <Ruler className="w-3 h-3" />
                                    Size Guide
                                </button>
                            </div>
                            <SizeSelector
                                selectedSize={selectedSize}
                                onSelect={setSelectedSize}
                                productSizes={product.sizes}
                            />
                            {/* Show specific stock for selected size */}
                            {selectedSize && product.sizes && (
                                <div className="mt-4">
                                    {(product.sizes[selectedSize] || 0) === 0 ? (
                                        <p className="text-xs text-rose-600 font-bold uppercase tracking-widest animate-pulse">
                                            Out of Stock
                                        </p>
                                    ) : (product.sizes[selectedSize] || 0) <= 5 ? (
                                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">
                                            Low Stock: Only {product.sizes[selectedSize]} left in {selectedSize}
                                        </p>
                                    ) : null}
                                </div>
                            )}

                        </div>

                        {/* Payment Method Selection */}
                        <div className="mb-8">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-3 block">Payment Method</label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Cash on Delivery */}
                                <button
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200
                                        ${paymentMethod === 'cod'
                                            ? 'bg-slate-50 border-slate-900 shadow-sm'
                                            : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                >
                                    <Banknote className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-slate-900' : 'text-slate-400'}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${paymentMethod === 'cod' ? 'text-slate-900' : 'text-slate-500'}`}>
                                        Cash on Delivery
                                    </span>
                                    {paymentMethod === 'cod' && (
                                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-900" />
                                    )}
                                </button>

                                {/* Online Payment */}
                                <button
                                    onClick={() => setPaymentMethod('online')}
                                    className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200
                                        ${paymentMethod === 'online'
                                            ? 'bg-slate-50 border-slate-900 shadow-sm'
                                            : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                >
                                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'online' ? 'text-slate-900' : 'text-slate-400'}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${paymentMethod === 'online' ? 'text-slate-900' : 'text-slate-500'}`}>
                                        Online Payment
                                    </span>
                                    <span className="absolute -top-2 right-2 bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                                        Coming Soon
                                    </span>
                                </button>
                            </div>

                            {/* Info Message for Online Payment */}
                            {paymentMethod === 'online' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-3 flex items-start gap-2 bg-blue-50/50 p-3 rounded-md border border-blue-100"
                                >
                                    <div className="w-1 h-full min-h-[1.25rem] bg-blue-400 rounded-full shrink-0" />
                                    <p className="text-[11px] text-slate-600 leading-relaxed">
                                        Secure online payment available soon. Currently accepting <span className="font-bold text-slate-900">COD orders only</span>.
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        {(() => {
                            // Calculate stock logic dynamically
                            const maxStock = product.sizes && selectedSize ? (product.sizes[selectedSize] || 0) : product.stock
                            // Use cart from the top-level hook instead of calling it conditionally
                            const cartItem = cart.find(item => item.id === product.id && item.selectedSize === selectedSize)
                            const qtyInCart = cartItem ? cartItem.quantity : 0
                            const isFullyInCart = selectedSize && (qtyInCart >= maxStock)

                            return (
                                <button
                                    onClick={() => addToCart({ ...product, selectedSize }, 1, maxStock)}
                                    disabled={!selectedSize || maxStock === 0 || isFullyInCart}
                                    className={`w-full text-xs font-bold uppercase tracking-[0.3em] py-4 mb-8 transition-all disabled:cursor-not-allowed
                                        ${isFullyInCart
                                            ? 'bg-gray-100 text-gray-400 border border-gray-200'
                                            : 'bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-40'}`}
                                >
                                    {!selectedSize
                                        ? 'Select a Size'
                                        : maxStock === 0
                                            ? 'Size Out of Stock'
                                            : isFullyInCart
                                                ? `Already in Cart (Max ${maxStock})`
                                                : 'Add to Cart'}
                                </button>
                            )
                        })()}


                        {/* Accordion Sections */}
                        <div className="space-y-1">
                            <AccordionItem
                                title="Product Details"
                                isOpen={openAccordion === 'details'}
                                onClick={() => toggleAccordion('details')}
                            >
                                <p>{product.product_details || product.description || 'No product details available.'}</p>
                                <ul className="list-disc list-inside mt-4 space-y-1 opacity-80">
                                    <li>Premium construction for lasting durability</li>
                                    <li>Designed for modern aesthetic and comfort</li>
                                    <li>Imported materials</li>
                                </ul>
                            </AccordionItem>

                            <AccordionItem
                                title="Fabric & Care"
                                isOpen={openAccordion === 'fabric'}
                                onClick={() => toggleAccordion('fabric')}
                            >
                                <p>{product.fabric_care || 'Hand wash cold. Do not bleach. Line dry. Iron low heat if necessary.'}</p>
                                <p className="mt-2">Material: 100% Premium Cotton Blend.</p>
                            </AccordionItem>

                            <AccordionItem
                                title="Shipping & Returns"
                                isOpen={openAccordion === 'shipping'}
                                onClick={() => toggleAccordion('shipping')}
                            >
                                {product.shipping_info ? (
                                    <p>{product.shipping_info}</p>
                                ) : (
                                    <>
                                        <p>Standard Shipping: PKR 250 flat rate for all domestic orders.</p>
                                        <p className="mt-2">Estimated delivery: 3-5 working days.</p>
                                        <p className="mt-2">Exchanges accepted within 7 days of delivery. Items must be unworn, in original condition, and with tags attached. No cash refunds.</p>
                                    </>
                                )}
                            </AccordionItem>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
