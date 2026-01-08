"use client"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Loader2, SlidersHorizontal, ChevronDown, Heart, ShoppingCart } from 'lucide-react'
import { CLOTHES, ACCESSORIES } from '@/lib/data'
import FilterSidebar from '@/components/FilterSidebar'
import ProductCard from '@/components/ProductCard'

export default function CategoryPage() {
    const params = useParams()
    const slug = params.slug
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('featured')
    const [isSortOpen, setIsSortOpen] = useState(false) // New state for custom dropdown
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filters, setFilters] = useState({
        availability: [],
        priceRange: { min: 0, max: 50000 },
        sizes: []
    })

    const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'best-selling', label: 'Best Selling' },
        { value: 'alphabetical-az', label: 'A-Z' },
        { value: 'alphabetical-za', label: 'Z-A' },
        { value: 'price-low', label: 'Price: Low' },
        { value: 'price-high', label: 'Price: High' },
        { value: 'date-old', label: 'Date: Old' },
        { value: 'date-new', label: 'Date: New' },
    ]

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
                // For now, same as featured. You can add sales data later
                return sorted
            case 'featured':
            default:
                return sorted
        }
    }

    const allCategories = [...CLOTHES, ...ACCESSORIES]
    const currentCategory = allCategories.find(c => c.slug === slug)

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                // Step 1: Fetch the category ID from categories table using the slug
                const categoryRes = await fetch(`/api/categories`)
                const categoriesData = await categoryRes.json()
                setCategories(categoriesData)
                const category = Array.isArray(categoriesData) ? categoriesData.find(c => c.slug === slug) : null

                if (!category) {
                    console.warn(`Category with slug "${slug}" not found`)
                    setProducts([])
                    setLoading(false)
                    return
                }

                // Step 2: Fetch products and filter by category_id (UUID)
                const productsRes = await fetch('/api/products')
                const allProducts = await productsRes.json()

                if (Array.isArray(allProducts)) {
                    const filtered = allProducts.filter(p => p.category_id === category.id)
                    setProducts(filtered)
                }
            } catch (e) {
                console.error("Fetch failed", e)
            } finally {
                setLoading(false)
            }
        }
        if (slug) fetchCategoryProducts()
    }, [slug])

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
            filtered = filtered.filter(p => filters.sizes.includes(p.size))
        }

        return filtered
    }

    // Get category name helper
    const getCategoryName = (categoryId) => {
        const cat = categories.find(c => c.id === categoryId)
        return cat?.name || ''
    }

    if (!currentCategory) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <h1 className="text-2xl font-serif mb-6 text-slate-900 tracking-widest uppercase">Collection Not Found</h1>
                <Link href="/" className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-400 hover:text-slate-900 transition-colors border-b border-slate-200 pb-1">
                    Return to Selection
                </Link>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Unified Compact Actions Header */}
            <div className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-sm z-30 transition-all duration-300">
                <div className="container mx-auto px-6 lg:px-12 py-3 lg:py-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        {/* Left: Title & Description */}
                        <div>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-slate-900 transition-all mb-1 group"
                            >
                                <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                                Back
                            </Link>
                            <h1 className="text-3xl lg:text-4xl font-serif text-slate-900 tracking-tight uppercase leading-none">
                                {currentCategory.name}
                            </h1>
                            <p className="text-xs text-slate-400 font-light mt-1 max-w-md">
                                Discover our curated selection of {currentCategory.name.toLowerCase()} pieces.
                            </p>
                        </div>

                        {/* Right: Controls (Filter & Sort) */}
                        <div className="flex items-center gap-4 pb-1 self-end">
                            {/* Filter Button - Styled as Outline Pill */}
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:text-rose-600"
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                Filter
                            </button>

                            {/* Sort Dropdown - Custom Implementation for Exact Width */}
                            <div className="relative w-36">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="w-full flex items-center justify-between px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:text-rose-600 outline-none group"
                                >
                                    <span className="truncate">{sortOptions.find(o => o.value === sortBy)?.label || 'Featured'}</span>
                                    <ChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-rose-600 transition-colors duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isSortOpen && (
                                    <>
                                        {/* Backdrop to handle click-outside */}
                                        <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />

                                        {/* Dropdown Menu - Matches Width Exactly */}
                                        <div className="absolute top-full right-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSortBy(option.value)
                                                        setIsSortOpen(false)
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${sortBy === option.value
                                                        ? 'bg-slate-50 text-rose-600'
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="container mx-auto px-6 lg:px-12 py-4 lg:py-8">
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
                />

                {/* Products */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
                        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-400">Loading Collection...</p>
                    </div>
                ) : applyFilters(products).length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {sortProducts(applyFilters(products), sortBy).map((product, index) => (
                            <motion.div
                                key={product.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                            >
                                <ProductCard
                                    product={product}
                                    categoryName={getCategoryName(product.category_id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40">
                        <p className="text-slate-400 text-sm mb-8">This collection is currently being curated.</p>
                        <Link href="/" className="inline-block px-8 py-3 bg-slate-900 text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-slate-800 transition-all">
                            Explore Other Collections
                        </Link>
                    </div>
                )}
            </div>
        </main>
    )
}
