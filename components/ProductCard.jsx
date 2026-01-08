"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'

export default function ProductCard({ product, categoryName, showRemoveButton = false }) {
    const { toggleWishlist, removeFromWishlist, isInWishlist } = useWishlist()

    const {
        id,
        name = "Untitled Product",
        price = 0,
        image_url,
        stock = product.stock_count ?? product.stock ?? 0
    } = product

    return (
        <Link href={`/products/${id}`} className="group block">
            {/* Product Image */}
            <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-slate-50">
                {image_url ? (
                    <img
                        src={image_url}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-slate-300 text-xs">No Image</span>
                    </div>
                )}

                {/* Unified Action Stack - Top Right */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2.5">
                    {/* Heart Icon - Logic varies by page */}
                    {showRemoveButton ? (
                        // Wishlist Page: STATUS ONLY (Static, no toggle)
                        <div
                            className="p-2.5 bg-white rounded-full shadow-md text-rose-600 flex items-center justify-center border border-gray-100/50 cursor-default"
                            title="Saved to Wishlist"
                        >
                            <Heart className="h-4 w-4 fill-rose-600" />
                        </div>
                    ) : (
                        // Shop All/Other Pages: TOGGLE (Add/Remove)
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleWishlist(product)
                            }}
                            className="p-2.5 bg-white rounded-full shadow-md text-slate-900 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 flex items-center justify-center border border-gray-100/50"
                            title={isInWishlist(id) ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart className={`h-4 w-4 transition-colors ${isInWishlist(id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                        </button>
                    )}

                    {/* Trash Icon (Always Hard Remove) */}
                    {showRemoveButton && (
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                removeFromWishlist(id)
                            }}
                            className="p-2.5 bg-white rounded-full shadow-md text-slate-900 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-[400ms] flex items-center justify-center border border-gray-100/50"
                            title="Remove from wishlist"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-1">
                <h3 className="text-xs font-medium uppercase tracking-wider text-slate-900 group-hover:text-slate-600 transition-colors">
                    {name}
                </h3>
                {categoryName && (
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        {categoryName}
                    </p>
                )}
                <p className="text-sm font-light text-slate-900 pt-1">
                    PKR {Number(price).toLocaleString()}
                </p>
            </div>
        </Link>
    )
}
