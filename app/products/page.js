"use client"
import { useState, useEffect, Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import ProductCard from '@/components/ProductCard'
import { motion } from 'framer-motion'
import { supabase } from '@/utils/supabase/client'
import { Search } from 'lucide-react'
import FilterSidebar from '@/components/FilterSidebar'
import { useSearchParams } from 'next/navigation'

function ProductsContent() {
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get('search') || ''

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(initialSearch)
    const [sortBy, setSortBy] = useState('featured')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filters, setFilters] = useState({
        availability: [],
        priceRange: { min: 0, max: 50000 },
        sizes: [],
        categories: []
    })

    // Filter products based on selected filters
    const applyFilters = (productsToFilter) => {
        let filtered = [...productsToFilter]

        // Availability filter
        if (filters.availability.length > 0) {
            filtered = filtered.filter(p => {
                if (filters.availability.includes('in-stock') && p.stock > 0) return true
                if (filters.availability.includes('out-of-stock') && p.stock === 0) return true
                return false
            })
        }

        // Price range filter
        filtered = filtered.filter(p => {
            const price = Number(p.price)
            return price >= filters.priceRange.min && price <= filters.priceRange.max
        })

        // Size filter
        if (filters.sizes.length > 0) {
            filtered = filtered.filter(p => {
                // Check if product has sizes map
                if (p.sizes && Object.keys(p.sizes).length > 0) {
                    return Object.keys(p.sizes).some(size => filters.sizes.includes(size))
                }
                // Fallback to available_sizes array
                else if (p.available_sizes && Array.isArray(p.available_sizes)) {
                    return p.available_sizes.some(size => filters.sizes.includes(size))
                }
                return false
            })
        }

        // Category filter
        if (filters.categories.length > 0) {
            filtered = filtered.filter(p => filters.categories.includes(p.category_id))
        }

        return filtered
    }

    // Sorting function
    const sortProducts = (productsToSort, sortOption) => {
        const sorted = [...productsToSort]

        switch (sortOption) {
            case 'alphabetical-az':
                return sorted.sort((a, b) => a.name.localeCompare(b.name))
            case 'alphabetical-za':
                return sorted.sort((a, b) => b.name.localeCompare(a.name))
            case 'price-low':
                return sorted.sort((a, b) => Number(a.price) - Number(b.price))
            case 'price-high':
                return sorted.sort((a, b) => Number(b.price) - Number(a.price))
            case 'date-old':
                return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            case 'date-new':
                return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            case 'best-selling':
                return sorted
            case 'featured':
            default:
                return sorted
        }
    }

    useEffect(() => {
        async function loadProducts() {
            try {
                // Fetch categories
                const catRes = await fetch('/api/categories')
                const catData = await catRes.json()
                setCategories(catData)

                // Fetch products
                const res = await fetch('/api/products')
                const data = await res.json()
                if (Array.isArray(data)) {
                    setProducts(data)
                }
            } catch (e) {
                console.error('Fetch error:', e)
            } finally {
                setLoading(false)
            }
        }
        loadProducts()
    }, [])

    // Get category name helper
    const getCategoryName = (categoryId) => {
        const cat = categories.find(c => c.id === categoryId)
        return cat?.name || ''
    }

    const filtered = applyFilters(products).filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="container mx-auto px-4 pt-6 pb-24 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Exquisite Collection</h1>
                    <p className="text-slate-500 mt-1 font-light tracking-wide">Browse our complete inventory of luxury fashion.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                            placeholder="Search collection..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-xs font-medium uppercase tracking-wider text-slate-600 hover:text-slate-900 cursor-pointer outline-none focus:ring-1 focus:ring-slate-900"
                        >
                            <option value="featured">Featured</option>
                            <option value="best-selling">Best Selling</option>
                            <option value="alphabetical-az">A-Z</option>
                            <option value="alphabetical-za">Z-A</option>
                            <option value="price-low">Price: Low-High</option>
                            <option value="price-high">Price: High-Low</option>
                            <option value="date-old">Date: Old-New</option>
                            <option value="date-new">Date: New-Old</option>
                        </select>
                        <svg className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Grid with Sidebar */}
            {/* Filter Sidebar (Slide-out for all screens) */}
            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFilterChange={(newFilters) => {
                    setFilters(newFilters)
                    setIsFilterOpen(false)
                }}
                products={products}
                categories={categories}
            />

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="h-96 bg-gray-100 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    {sortProducts(filtered, sortBy).map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            categoryName={getCategoryName(product.category_id)}
                        />
                    ))}
                </motion.div>
            )}

            {/* Empty Search State */}
            {!loading && filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No products found matching your search.</p>
                    <button
                        onClick={() => setSearch('')}
                        className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                    >
                        Clear Search
                    </button>
                </div>
            )}
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <ProductsContent />
        </Suspense>
    )
}
