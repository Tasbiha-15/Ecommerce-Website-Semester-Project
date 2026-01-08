"use client"
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Pencil, Trash2, Search, Package, ShoppingCart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { supabase } from '@/utils/supabase/client'

function ProductManagementContent() {
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get('search') || ''

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState(initialSearch)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSellModalOpen, setIsSellModalOpen] = useState(false)

    useEffect(() => {
        const query = searchParams.get('search')
        if (query !== null) {
            setSearch(query)
        }
    }, [searchParams])
    const [editingProduct, setEditingProduct] = useState(null)
    const [sellProduct, setSellProduct] = useState(null)
    const [sellQty, setSellQty] = useState(1)

    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false) // Kept for internal logic if needed, but button will use isSubmitting

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock_count: 0, // Calculated automatically
        category_id: '',
        image_url: '',
        available_sizes: ['XS', 'S', 'M', 'L', 'XL'], // Keep for display chips logic. 
        sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0 }, // New individual size tracking
        product_details: '',
        fabric_care: '',
        shipping_info: '',
        low_stock_threshold: 10
    })

    // Fallback categories in case DB fetch fails
    const FALLBACK_CATEGORIES = [
        { id: '1', name: 'Luxury Unstitched', slug: 'luxury-unstitched' },
        { id: '2', name: 'Formal Edit', slug: 'formal-edit' },
        { id: '3', name: 'Wedding Edit', slug: 'wedding-edit' },
        { id: '4', name: 'Easy Glam', slug: 'easy-glam' },
        { id: '5', name: 'MNM Everywear', slug: 'mnm-everywear' },
        { id: '6', name: 'Jewelry', slug: 'jewelry' },
        { id: '7', name: 'Bags', slug: 'bags' }
    ]

    useEffect(() => {
        fetchCategories()
        fetchProducts()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories', { cache: 'no-store' })
            if (!res.ok) throw new Error('Failed to fetch categories')

            const data = await res.json()
            console.log(`fetchCategories received ${data?.length || 0} categories:`, data) // Debug log

            if (Array.isArray(data) && data.length > 0) {
                setCategories(data)
                // Set default category_id to first category's ID
                if (!formData.category_id) {
                    setFormData(prev => ({ ...prev, category_id: data[0].id }))
                }
            } else {
                // Use fallback if API returns empty
                console.warn('Categories table is empty, using fallback data')
                setCategories(FALLBACK_CATEGORIES)
                setFormData(prev => ({ ...prev, category_id: FALLBACK_CATEGORIES[0].id }))
                toast.error("Using default categories. Please add categories to your database.")
            }
        } catch (e) {
            console.error('Failed to load categories:', e)
            setCategories(FALLBACK_CATEGORIES)
            setFormData(prev => ({ ...prev, category_id: FALLBACK_CATEGORIES[0].id }))
            toast.error("Failed to load categories from database. Using defaults.")
        }
    }

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/products')
            const data = await res.json()
            if (Array.isArray(data)) setProducts(data)
        } catch (e) {
            toast.error("Failed to load products")
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (file) => {
        try {
            setUploading(true)
            const fileExt = file.name.split('.').pop()
            const sanitizedName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '').substring(0, 20)
            const fileName = `${sanitizedName}-${Date.now()}.${fileExt}`
            const filePath = `products/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            return publicUrl
        } catch (error) {
            console.error('Upload Error Details:', error)
            toast.error(error.message || "Image upload failed. Check network or storage limits.")
            return null
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Validate category is selected
            if (!formData.category_id) {
                toast.error('Please select a category')
                setIsSubmitting(false)
                return
            }

            let finalImageUrl = formData.image_url || ''

            if (imageFile) {
                const uploadedUrl = await handleFileUpload(imageFile)
                if (!uploadedUrl) {
                    toast.error("Image upload failed. Aborting save.")
                    setIsSubmitting(false)
                    return
                }
                finalImageUrl = uploadedUrl
            }

            // Create clean payload with explicit type safety
            const payload = {
                name: String(formData.name || '').trim(),
                sku: String(formData.sku || '').trim(),
                price: Number(formData.price) || 0,
                stock_count: Number(formData.stock_count || formData.stock || 0),
                category_id: String(formData.category_id),
                image_url: String(finalImageUrl || ''),
                // TEXT[] array - strict string filtering
                available_sizes: Array.isArray(formData.available_sizes)
                    ? formData.available_sizes.filter(size => typeof size === 'string' && size.trim().length > 0)
                    : ['S', 'M', 'L'],
                product_details: String(formData.product_details || ''),
                fabric_care: String(formData.fabric_care || ''),
                shipping_info: String(formData.shipping_info || ''),
                low_stock_threshold: Number(formData.low_stock_threshold || 10),
                sizes: formData.sizes // Send sizes object to backend
            }

            // Ensure available_sizes is never empty if that's a requirement, or just clean
            if (payload.available_sizes.length === 0) {
                payload.available_sizes = ['S', 'M', 'L']
            }

            console.log('Sending payload:', JSON.stringify(payload, null, 2)) // Debug log

            // Timeout logic
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

            let res
            try {
                // Use dynamic route for updates: /api/products/[id]
                const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
                const method = editingProduct ? 'PUT' : 'POST'

                res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                })
            } finally {
                clearTimeout(timeoutId)
            }

            const result = await res.json()
            console.log('API Response:', result) // Debug log

            if (res.ok) {
                toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully!`)
                setIsModalOpen(false)
                resetForm()
                fetchProducts()
            } else {
                // Better error handling for schema mismatch
                console.error('API Error:', result)
                if (result.error && result.error.includes("column")) {
                    toast.error("Database schema error: " + result.error)
                } else if (result.error) {
                    toast.error(result.error)
                } else {
                    toast.error("Failed to save product")
                }
            }
        } catch (e) {
            console.error('Save Error:', e)
            if (e.name === 'AbortError') {
                toast.error("Request timed out. Please try again.")
            } else {
                toast.error("Failed to save product: " + (e.message || 'Unknown error'))
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        const defaultCategoryId = categories.length > 0 ? categories[0].id : ''
        setFormData({
            name: '',
            sku: '',
            price: '',
            stock: '',
            stock_count: 0,
            category_id: defaultCategoryId,
            image_url: '',
            available_sizes: ['S', 'M', 'L'],
            product_details: '',
            fabric_care: '',
            shipping_info: '',
            low_stock_threshold: 10,
            sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0 }
        })
        setImageFile(null)
        setImagePreview(null)
        setEditingProduct(null)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            available_sizes: prev.available_sizes.includes(size)
                ? prev.available_sizes.filter(s => s !== size)
                : [...prev.available_sizes, size]
        }))
    }

    const openEdit = (product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name || '',
            sku: product.sku || '',
            price: product.price || '',
            stock: product.stock || '',
            stock_count: product.stock_count || product.stock || 0,
            category_id: product.category_id || (categories.length > 0 ? categories[0].id : ''),
            image_url: product.image_url || '',
            available_sizes: Array.isArray(product.available_sizes) ? product.available_sizes : ['S', 'M', 'L'],
            product_details: product.product_details || '',
            fabric_care: product.fabric_care || '',
            shipping_info: product.shipping_info || '',
            low_stock_threshold: product.low_stock_threshold || 10,
            sizes: {
                XS: 0, S: 0, M: 0, L: 0, XL: 0,
                ...(product.sizes || {})
            } // Populate sizes from API with defaults for missing keys
        })
        setImagePreview(product.image_url)
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure? This will remove the item from the database.")) return
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success("Product deleted successfully")
                setProducts(prev => prev.filter(p => p.id !== id))
            } else {
                toast.error("Failed to delete")
            }
        } catch (e) {
            toast.error("Delete failed")
        }
    }

    const handleQuickSell = async () => {
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: 'Walk-in Customer',
                    total_amount: sellProduct.price * sellQty,
                    items: [{ ...sellProduct, quantity: sellQty }]
                })
            })
            if (res.ok) {
                toast.success("Sale recorded")
                setIsSellModalOpen(false)
                fetchProducts()
            } else {
                toast.error("Failed to record sale")
            }
        } catch (e) {
            toast.error("Error processing sale")
        }
    }

    const filteredProducts = products.filter(p => {
        const categoryName = categories.find(c => c.id === p.category_id)?.name || ''
        return (
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
            categoryName.toLowerCase().includes(search.toLowerCase())
        )
    })
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-serif">Inventory</h1>
                    <p className="text-slate-500 mt-1">Manage your products, stock levels, and pricing.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsModalOpen(true) }}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full shadow-md transition-all flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Add Product</span>
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        placeholder="Search by name, SKU, or category..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-100 focus:border-slate-400 outline-none text-sm transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Product Table */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                                <p className="text-sm font-medium">Loading inventory...</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 w-[40%]">Product Name</th>
                                        <th className="px-6 py-4">SKU</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="h-4 w-4 text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-slate-900 block">{product.name}</span>
                                                        {product.stock_count <= (product.low_stock_threshold || 10) && <span className="text-[10px] text-rose-500 font-medium">Low Stock</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">{product.sku}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium capitalize">
                                                    {categories.find(c => c.id === product.category_id)?.name || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">PKR {Number(product.price).toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <div className={`font-medium ${(product.stock_count || 0) <= (product.low_stock_threshold || 10) ? "text-rose-600" : "text-emerald-600"}`}>
                                                    {product.stock_count || 0} units
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100" onClick={() => { setSellProduct(product); setIsSellModalOpen(true) }}>
                                                        <ShoppingCart className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100" onClick={() => openEdit(product)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100" onClick={() => handleDelete(product.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {!loading && filteredProducts.length === 0 && (
                            <div className="text-center py-20">
                                <Package className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">No products found.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-2xl bg-white shadow-xl border-none animate-in zoom-in-95 duration-200 rounded-xl overflow-hidden max-h-[90vh] flex flex-col">
                        <CardHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold text-slate-900 font-sans">
                                {editingProduct ? 'Edit Product' : 'Add Product'}
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-8 w-8 text-slate-400 hover:text-slate-600"><Trash2 className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent className="px-6 py-6 overflow-y-auto">
                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Primary Image Upload */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Primary Image</label>
                                    <div className="flex gap-4">
                                        <div className="h-20 w-20 rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center flex-shrink-0 relative overflow-hidden group hover:border-slate-400 transition-colors">
                                            {imagePreview ? (
                                                <>
                                                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => { setImageFile(null); setImagePreview(null) }}>
                                                        <Trash2 className="h-4 w-4 text-white" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center text-slate-400">
                                                    <span className="text-[9px] block">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="relative border border-slate-200 rounded-lg px-3 py-2 bg-white hover:border-slate-300 transition-colors cursor-pointer h-20 flex flex-col items-center justify-center">
                                                <p className="text-xs text-center text-slate-600 font-medium">Click to upload file</p>
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Info Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Name <span className="text-rose-500">*</span></label>
                                        <input className="w-full border border-slate-200 rounded-lg px-3 h-9 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition-all placeholder:text-slate-300" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Embroidered Lawn Dress" required />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SKU <span className="text-rose-500">*</span></label>
                                        <input className="w-full border border-slate-200 rounded-lg px-3 h-9 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition-all placeholder:text-slate-300" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g. LAL-001" required />
                                    </div>
                                </div>

                                {/* Category & Pricing Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category <span className="text-rose-500">*</span></label>
                                        <select
                                            className="w-full border border-slate-200 rounded-lg px-3 h-9 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none bg-white"
                                            value={formData.category_id}
                                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                            required
                                        >
                                            {categories.length === 0 && <option value="">Loading...</option>}
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price (PKR) <span className="text-rose-500">*</span></label>
                                        <input type="number" className="w-full border border-slate-200 rounded-lg px-3 h-9 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0" required />
                                    </div>

                                    <div className="space-y-2 col-span-3">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            Stock Distribution <span className="text-rose-500">*</span>
                                            <span className="ml-2 text-slate-400 font-normal normal-case">(Total: {Object.values(formData.sizes).reduce((a, b) => a + Number(b || 0), 0)})</span>
                                        </label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                                <div key={size} className="space-y-1">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase text-center block">{size}</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="w-full border border-slate-200 rounded-lg px-2 h-9 text-sm text-center focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
                                                        value={formData.sizes[size] ?? 0}
                                                        onChange={e => setFormData(prev => ({
                                                            ...prev,
                                                            sizes: { ...prev.sizes, [size]: e.target.value }
                                                        }))}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Available Sizes */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Available Sizes</label>
                                    <div className="flex gap-2">
                                        {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSize(size)}
                                                className={`h-9 w-12 text-xs font-bold rounded-lg border-2 transition-all ${formData.available_sizes.includes(size)
                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Product Details Accordion Content */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Product Details</label>
                                    <textarea
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none min-h-[80px] resize-y"
                                        value={formData.product_details}
                                        onChange={e => setFormData({ ...formData, product_details: e.target.value })}
                                        placeholder="Premium construction for lasting durability..."
                                    />
                                </div>

                                {/* Fabric & Care */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Fabric & Care</label>
                                    <textarea
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none min-h-[80px] resize-y"
                                        value={formData.fabric_care}
                                        onChange={e => setFormData({ ...formData, fabric_care: e.target.value })}
                                        placeholder="Hand wash cold. Do not bleach..."
                                    />
                                </div>

                                {/* Shipping Info */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Shipping & Returns</label>
                                    <textarea
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none min-h-[80px] resize-y"
                                        value={formData.shipping_info}
                                        onChange={e => setFormData({ ...formData, shipping_info: e.target.value })}
                                        placeholder="Standard Shipping: PKR 250. Free > PKR 15,000..."
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900 rounded-full">Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-200 rounded-full px-6">
                                        {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Quick Sell Modal */}
            {isSellModalOpen && sellProduct && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-sm bg-white shadow-xl border-none animate-in zoom-in-95 duration-200 rounded-xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 px-8 py-8 border-b border-slate-100">
                            <CardTitle className="font-serif text-lg font-bold text-slate-900 uppercase tracking-widest leading-tight">Quick Disbursement</CardTitle>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">{sellProduct.name}</p>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Price:</span>
                                <span className="font-serif text-lg text-slate-900 font-bold">PKR {Number(sellProduct.price).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Volume:</label>
                                <div className="flex items-center gap-3">
                                    <input type="number" min="1" max={sellProduct.stock_count || 0} className="border-2 border-slate-100 rounded-xl p-3 w-20 text-center font-bold text-slate-900 focus:border-slate-900 outline-none" value={sellQty} onChange={e => setSellQty(Number(e.target.value))} />
                                    <span className="text-[8px] font-bold text-slate-300 uppercase">/ {sellProduct.stock_count || 0} Stock</span>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-[24px] flex justify-between items-center text-white shadow-2xl">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Revenue:</span>
                                <span className="font-serif text-2xl font-bold tracking-tighter">PKR {(sellProduct.price * sellQty).toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col gap-3 pt-2">
                                <Button onClick={handleQuickSell} className="w-full bg-slate-900 text-white py-7 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-lg active:scale-95 transition-all">
                                    Release inventory
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Volume:</label>
                                <div className="flex items-center gap-3">
                                    <input type="number" min="1" max={sellProduct.stock_count || 0} className="border-2 border-slate-100 rounded-xl p-3 w-20 text-center font-bold text-slate-900 focus:border-slate-900 outline-none" value={sellQty} onChange={e => setSellQty(Number(e.target.value))} />
                                    <span className="text-[8px] font-bold text-slate-300 uppercase">/ {sellProduct.stock_count || 0} Stock</span>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-[24px] flex justify-between items-center text-white shadow-2xl">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Revenue:</span>
                                <span className="font-serif text-2xl font-bold tracking-tighter">PKR {(sellProduct.price * sellQty).toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col gap-3 pt-2">
                                <Button onClick={handleQuickSell} className="w-full bg-slate-900 text-white py-7 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-lg active:scale-95 transition-all">
                                    Release inventory
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setIsSellModalOpen(false)} className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-[0.3em]">Cancel</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
            }
        </div >
    )
}

export default ProductManagementContent;