"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import StockAlert from '@/components/ui/StockAlert'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [stockAlert, setStockAlert] = useState({
        isOpen: false,
        message: '',
        availableStock: 0,
        itemName: ''
    })

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('purple_cart')
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
    }, [])

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('purple_cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (product, quantity = 1, availableStock = Infinity) => {
        // Calculate total quantity including what's already in cart
        const existingItem = cart.find(item => item.id === product.id)
        const currentQty = existingItem ? existingItem.quantity : 0
        const totalRequested = currentQty + quantity

        if (totalRequested > availableStock) {
            setStockAlert({
                isOpen: true,
                message: `Cannot add more. You already have the maximum available stock (${availableStock}) for this size in your cart.`,
                availableStock,
                itemName: product.name
            })
            return // Stop execution
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                )
            }
            return [...prev, { ...product, quantity }]
        })

        // Side effects outside updater
        toast.success(`Added ${product.name} to cart`)
        setIsOpen(true)
    }

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId))
        toast.error('Removed from cart')
        // Close alert if the removed item was the one triggering it
        if (stockAlert.isOpen) {
            setStockAlert({ isOpen: false, message: '', availableStock: 0 })
        }
    }

    const updateQuantity = async (productId, delta) => {
        const item = cart.find(i => i.id === productId)
        if (!item) return { success: false }

        const newQty = Math.max(1, item.quantity + delta)

        // Only validate if increasing quantity
        if (delta > 0) {
            try {
                const response = await fetch('/api/cart/validate-stock', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: [{ id: productId, size: item.selectedSize, quantity: newQty }]
                    })
                })

                const result = await response.json()
                const validation = result.items?.[0]

                if (!validation || !validation.valid) {
                    const availableStock = validation?.availableStock || 0

                    // Show custom persistent alert
                    setStockAlert({
                        isOpen: true,
                        message: `Only ${availableStock} items available for size ${item.selectedSize}`,
                        availableStock,
                        itemName: item.name
                    })

                    return { success: false, availableStock } // Return failure and stock for inline UI
                }
            } catch (error) {
                console.error('Stock validation error:', error)
                toast.error('Unable to verify stock availability')
                return { success: false }
            }
        }

        // If validation passed or decreasing, update quantity
        setCart(prev => prev.map(i => {
            if (i.id === productId) {
                return { ...i, quantity: newQty }
            }
            return i
        }))

        // Close alert if we successfully updated (e.g. decreased quantity to valid level)
        // Or if we increased and it was valid, we can close any previous alert for this item
        if (stockAlert.isOpen && stockAlert.itemName === item.name) {
            setStockAlert({ isOpen: false, message: '', availableStock: 0 })
        }

        return { success: true }
    }

    const validateCartStock = async () => {
        if (cart.length === 0) return { valid: true, items: [] }

        try {
            const itemsToValidate = cart.map(item => ({
                id: item.id,
                size: item.selectedSize,
                quantity: item.quantity
            }))

            const response = await fetch('/api/cart/validate-stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: itemsToValidate })
            })

            return await response.json()
        } catch (error) {
            console.error('Cart validation error:', error)
            return { valid: false, items: [], error: 'Validation failed' }
        }
    }

    const clearCart = () => setCart([])

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
    const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    // Shipping Logic: Flat Rate PKR 250
    const SHIPPING_FLAT_RATE = 250

    const shippingFee = cartSubtotal > 0 ? SHIPPING_FLAT_RATE : 0
    const finalTotal = cartSubtotal + shippingFee

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, validateCartStock, clearCart,
            isOpen, setIsOpen, totalItems,
            cartTotal: cartSubtotal, // Maintaining name compatibility but it's now subtotal
            shippingFee,
            finalTotal
        }}>
            {children}
            <StockAlert
                isOpen={stockAlert.isOpen}
                onClose={() => setStockAlert({ ...stockAlert, isOpen: false })}
                message={stockAlert.message}
                availableStock={stockAlert.availableStock}
                itemName={stockAlert.itemName}
            />
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
