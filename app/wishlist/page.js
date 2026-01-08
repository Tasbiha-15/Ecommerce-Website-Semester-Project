"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useWishlist } from '@/context/WishlistContext'
import ProductCard from '@/components/ProductCard'

export default function WishlistPage() {
    const { wishlist } = useWishlist()
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories')
                const data = await res.json()
                setCategories(data)
            } catch (e) {
                console.error('Failed to fetch categories:', e)
            }
        }
        fetchCategories()
    }, [])

    const getCategoryName = (categoryId) => {
        const cat = categories.find(c => c.id === categoryId)
        return cat?.name || ''
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
            <div style={{ borderBottom: '1px solid #e5e5e5' }}>
                <div className="container mx-auto px-6 lg:px-12 py-2 lg:py-3">
                    <div className="flex items-end justify-between">
                        <div>
                            <Link
                                href="/"
                                className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-slate-900 transition-all mb-1"
                            >
                                ← Back
                            </Link>
                            <h1 className="text-3xl lg:text-5xl font-serif text-slate-900 tracking-tight uppercase">
                                My Wishlist
                            </h1>
                        </div>
                        <div className="pb-1">
                            <p className="text-xs text-slate-500 font-light">
                                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-6 lg:px-12 py-2 lg:py-4">
                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                        {wishlist.map((product, index) => (
                            <motion.div
                                key={product.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <ProductCard
                                    product={product}
                                    categoryName={getCategoryName(product.category_id)}
                                    showRemoveButton={true}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-4 text-slate-200 flex items-center justify-center border border-slate-100 rounded-full">
                            <span className="text-2xl">♡</span>
                        </div>
                        <h2 className="text-xl font-serif text-slate-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-slate-500 mb-6 text-sm">Start adding your favorite pieces</p>
                        <Link
                            href="/products"
                            className="inline-block px-6 py-2 bg-slate-900 text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-slate-800 transition-all"
                        >
                            Explore Collection
                        </Link>
                    </div>
                )}
            </div>
        </main>
    )
}
