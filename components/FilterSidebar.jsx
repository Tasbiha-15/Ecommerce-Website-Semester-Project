"use client"
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function FilterSidebar({ isOpen, onClose, filters, onFilterChange, products = [], categories = [] }) {
    const [localFilters, setLocalFilters] = useState({
        ...filters,
        categories: filters.categories || []
    })

    useEffect(() => {
        setLocalFilters({
            ...filters,
            categories: filters.categories || []
        })
    }, [filters])

    // Dynamic Calculations
    const maxPrice = products.length > 0
        ? Math.max(...products.map(p => Number(p.price)))
        : 50000

    // Calculate counts
    const inStockCount = products.filter(p => p.stock > 0).length
    const outOfStockCount = products.filter(p => p.stock === 0).length

    // Category Counts
    const categoryCounts = products.reduce((acc, product) => {
        if (product.category_id) {
            acc[product.category_id] = (acc[product.category_id] || 0) + 1
        }
        return acc
    }, {})

    const handleAvailabilityChange = (type) => {
        const newAvailability = localFilters.availability.includes(type)
            ? localFilters.availability.filter(a => a !== type)
            : [...localFilters.availability, type]

        setLocalFilters({ ...localFilters, availability: newAvailability })
    }

    const handleCategoryChange = (categoryId) => {
        const newCategories = localFilters.categories.includes(categoryId)
            ? localFilters.categories.filter(c => c !== categoryId)
            : [...localFilters.categories, categoryId]

        setLocalFilters({ ...localFilters, categories: newCategories })
    }

    const handlePriceChange = (field, value) => {
        setLocalFilters({
            ...localFilters,
            priceRange: { ...localFilters.priceRange, [field]: Number(value) }
        })
    }

    const applyFilters = () => {
        onFilterChange(localFilters)
    }

    const resetFilters = () => {
        const reset = {
            availability: [],
            priceRange: { min: 0, max: maxPrice },
            sizes: [],
            categories: []
        }
        setLocalFilters(reset)
        onFilterChange(reset)
    }

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-screen w-80 bg-white z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                border-r border-slate-200 overflow-y-auto shadow-2xl
            `}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Filters</h2>
                        <button
                            onClick={onClose}
                            className="lg:hidden text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Availability Section */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Availability</h3>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={localFilters.availability.includes('in-stock')}
                                        onChange={() => handleAvailabilityChange('in-stock')}
                                        className="w-4 h-4 border-2 border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-slate-900"
                                    />
                                    <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900">In Stock</span>
                                </div>
                                <span className="text-xs text-slate-400">({inStockCount})</span>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={localFilters.availability.includes('out-of-stock')}
                                        onChange={() => handleAvailabilityChange('out-of-stock')}
                                        className="w-4 h-4 border-2 border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-slate-900"
                                    />
                                    <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900">Out of Stock</span>
                                </div>
                                <span className="text-xs text-slate-400">({outOfStockCount})</span>
                            </label>
                        </div>
                    </div>

                    {/* Category Section */}
                    {categories.length > 0 && (
                        <div className="mb-8 border-t border-slate-100 pt-8">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Category</h3>
                            <div className="space-y-3">
                                {categories.map(category => (
                                    <label key={category.id} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={localFilters.categories.includes(category.id)}
                                                onChange={() => handleCategoryChange(category.id)}
                                                className="w-4 h-4 border-2 border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-slate-900"
                                            />
                                            <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900">{category.name}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">({categoryCounts[category.id] || 0})</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price Range Section */}
                    <div className="mb-8 border-t border-slate-100 pt-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Price</h3>
                        <div className="space-y-4">
                            <div className="text-sm text-slate-600">
                                Rs. {localFilters.priceRange.min.toLocaleString()} — Rs. {localFilters.priceRange.max.toLocaleString()}
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={maxPrice}
                                step="1000"
                                value={localFilters.priceRange.max}
                                onChange={(e) => handlePriceChange('max', e.target.value)}
                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Min</label>
                                    <input
                                        type="number"
                                        value={localFilters.priceRange.min}
                                        onChange={(e) => handlePriceChange('min', e.target.value)}
                                        className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Max</label>
                                    <input
                                        type="number"
                                        value={localFilters.priceRange.max}
                                        onChange={(e) => handlePriceChange('max', e.target.value)}
                                        className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 border-t border-slate-100 pt-6">
                        <button
                            onClick={applyFilters}
                            className="w-full bg-slate-900 text-white py-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={resetFilters}
                            className="w-full border border-slate-200 text-slate-600 py-3 text-xs font-bold uppercase tracking-wider hover:border-slate-900 hover:text-slate-900 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
