"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([])

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('wishlist')
        if (saved) {
            setWishlist(JSON.parse(saved))
        }
    }, [])

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }, [wishlist])

    const toggleWishlist = (product) => {
        const exists = wishlist.find(item => item.id === product.id)
        if (exists) {
            setWishlist(wishlist.filter(item => item.id !== product.id))
            toast.success('Removed from wishlist')
        } else {
            setWishlist([...wishlist, product])
            toast.success('Added to wishlist')
        }
    }

    const removeFromWishlist = (productId) => {
        setWishlist(wishlist.filter(item => item.id !== productId))
        toast.success('Removed from wishlist')
    }

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId)
    }

    return (
        <WishlistContext.Provider value={{
            wishlist,
            toggleWishlist,
            removeFromWishlist,
            isInWishlist,
            wishlistCount: wishlist.length
        }}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => useContext(WishlistContext)
