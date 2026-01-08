"use client"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation" // import useRouter
import { X, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function CartDrawer() {
    const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, cartTotal, shippingFee, finalTotal } = useCart()
    const { user } = useAuth()
    const router = useRouter()

    const [inlineErrors, setInlineErrors] = useState({})

    const handleQuantityUpdate = async (id, delta) => {
        // If decreasing, we can clear the error immediately
        if (delta < 0) {
            setInlineErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[id]
                return newErrors
            })
            await updateQuantity(id, delta)
            return
        }

        // If increasing, check result
        const result = await updateQuantity(id, delta)

        if (result && !result.success && result.availableStock !== undefined) {
            setInlineErrors(prev => ({
                ...prev,
                [id]: `Only ${result.availableStock} left in stock`
            }))
        } else {
            // Success, clear error if existed
            setInlineErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[id]
                return newErrors
            })
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b flex items-center justify-between bg-primary/5">
                    <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                            <p>Your cart is empty.</p>
                            <Button variant="link" onClick={() => setIsOpen(false)}>Continue Shopping</Button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-gray-50 border group hover:border-primary/20 transition-colors">
                                <div className="h-20 w-20 relative bg-white rounded-lg overflow-hidden border">
                                    {/* Using img for simplicity if domains not configured in next.config */}
                                    <img src={item.image_url} alt={item.name} className="object-cover h-full w-full" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                                        {item.selectedSize && <p className="text-xs text-gray-400 mt-1">Size: {item.selectedSize}</p>}
                                        <p className="text-xs text-gray-500 mt-0.5">PKR {item.price}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 bg-white rounded-full border px-2 py-1">
                                                <button onClick={() => handleQuantityUpdate(item.id, -1)} className="p-0.5 hover:text-primary"><Minus className="h-3 w-3" /></button>
                                                <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => handleQuantityUpdate(item.id, 1)} className="p-0.5 hover:text-primary"><Plus className="h-3 w-3" /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        {inlineErrors[item.id] && (
                                            <p className="text-[10px] text-red-500 font-medium animate-in slide-in-from-top-1">
                                                {inlineErrors[item.id]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t bg-gray-50 space-y-4">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-700 font-medium">
                                <span>Subtotal</span>
                                <span className="text-slate-900">PKR {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-700 font-medium">
                                <span>Shipping</span>
                                <span className={shippingFee === 0 ? "text-emerald-600 font-bold" : "text-slate-900"}>
                                    {shippingFee === 0 ? 'Free' : `PKR ${shippingFee}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold pt-3 border-t border-slate-200 text-slate-900">
                                <span>Total</span>
                                <span>PKR {finalTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {!user && (
                            <p className="text-xs text-center text-amber-600 font-medium bg-amber-50 p-2 rounded">
                                You must be logged in to checkout
                            </p>
                        )}

                        <Button
                            onClick={() => {
                                setIsOpen(false)
                                if (user) {
                                    router.push('/checkout')
                                } else {
                                    router.push('/login?next=/checkout')
                                }
                            }}
                            className="w-full h-12 bg-[#0a1128] text-white font-serif uppercase tracking-widest hover:bg-[#1a2340] rounded-md shadow-lg transition-colors">
                            {user ? 'Checkout' : 'Login to Checkout'}
                        </Button>
                    </div>
                )}
            </div>
        </div >
    )
}
