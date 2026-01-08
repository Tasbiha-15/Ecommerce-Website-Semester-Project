"use client"
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function Checkout() {
    const { cart, cartTotal, shippingFee, finalTotal, clearCart, validateCartStock } = useCart()
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const [loading, setLoading] = useState(false)
    const [stockValidation, setStockValidation] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Pre-fill email from auth
                setFormData(prev => ({ ...prev, email: user.email }))

                // Fetch extra details from customers table if they exist
                const { data: customer } = await supabase
                    .from('customers')
                    .select('full_name, phone, address')
                    .eq('email', user.email)
                    .maybeSingle()

                if (customer) {
                    setFormData(prev => ({
                        ...prev,
                        name: customer.full_name || '',
                        phone: customer.phone || '',
                        address: customer.address || ''
                    }))
                }
            }
        }
        fetchUserData()
    }, [])

    // Validate cart stock on mount
    useEffect(() => {
        const checkStock = async () => {
            const validation = await validateCartStock()
            setStockValidation(validation)
        }
        if (cart.length > 0) {
            checkStock()
        }
    }, [cart])

    const handleCallback = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (cart.length === 0) {
            toast.error("Your cart is empty")
            return
        }

        setLoading(true)
        try {
            // Call API to process order
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    address: formData.address,
                    total_amount: finalTotal,
                    items: cart
                })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Order placed successfully!")
                clearCart()
                router.push('/checkout/success')
            } else {
                toast.error(data.error || "Failed to place order")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <Button onClick={() => router.push('/')}>Go Shopping</Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-primary">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleCallback}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleCallback}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleCallback}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="+92 300 1234567"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <textarea
                                    required
                                    name="address"
                                    value={formData.address}
                                    onChange={handleCallback}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="123 Purple St"
                                    rows={3}
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-gray-500">Size: {item.selectedSize} × {item.quantity}</p>
                                </div>
                                <p className="font-semibold">PKR {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>PKR {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span>PKR {shippingFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total</span>
                                <span>PKR {finalTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Stock Validation Error Banner */}
                        {stockValidation && !stockValidation.valid && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                                <p className="text-red-800 font-semibold text-sm">⚠️ Stock Issues Detected</p>
                                <p className="text-red-700 text-xs">Some items exceed available stock. Please adjust quantities:</p>
                                <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
                                    {stockValidation.items?.filter(i => !i.valid).map((item, idx) => {
                                        const cartItem = cart.find(c => c.id === item.id && c.selectedSize === item.size)
                                        return (
                                            <li key={idx}>
                                                {cartItem?.name} (Size {item.size}): Requested {item.requestedQty}, Available {item.availableStock}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}

                        <Button
                            type="submit"
                            form="checkout-form"
                            className="w-full h-12 text-lg shadow-lg shadow-primary/20"
                            disabled={loading || (stockValidation && !stockValidation.valid)}
                        >
                            {loading ? "Processing..." : "Place Order"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
