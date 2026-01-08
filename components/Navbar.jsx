"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X, Search, User, Heart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const { setIsOpen, totalItems } = useCart()
    const { wishlistCount } = useWishlist()
    const { user, isAdmin: authContextIsAdmin, signOut } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAdminLocal, setIsAdminLocal] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // At the top (within 10px), always show solid
            if (currentScrollY < 10) {
                setIsVisible(true)
            } else if (currentScrollY > lastScrollY) {
                // Scrolling Down -> Hide (Transparent/Opacity 0)
                setIsVisible(false)
            } else {
                // Scrolling Up -> Show (Solid)
                setIsVisible(true)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    useEffect(() => {
        const checkRole = async () => {
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (profile?.role === 'admin') {
                    setIsAdminLocal(true)
                }
            } else {
                setIsAdminLocal(false)
            }
        }
        checkRole()
    }, [user])

    const showAdminLink = authContextIsAdmin || isAdminLocal

    // Hide Navbar on Admin pages
    if (pathname?.startsWith('/admin')) return null

    return (
        <nav
            className={cn(
                "sticky top-0 left-0 right-0 z-50 font-sans text-slate-900 transition-all duration-500 ease-in-out",
                isVisible
                    ? "bg-white border-b border-gray-100 opacity-100 translate-y-0 shadow-sm"
                    : "bg-transparent border-transparent opacity-0 -translate-y-full pointer-events-none"
            )}
        >
            {/* Top Row: Mobile Menu | Logo (Center) | Icons (Right) */}
            <div className="container mx-auto px-4 py-6 flex items-center justify-between relative">

                {/* Mobile Menu Spacer */}
                <div className="flex items-center gap-4 w-1/4">
                    <button className="lg:hidden text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <div className="hidden lg:block w-full"></div>
                </div>

                {/* Brand Logo - Absolute Center */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <Link href="/" className="group block">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold tracking-[0.2em] text-slate-900 uppercase whitespace-nowrap">
                            Maryum <span className="font-light text-slate-400">&</span> Maria
                        </h1>
                    </Link>
                </div>

                {/* Right Icons */}
                <div className="flex items-center justify-end gap-5 w-1/4">
                    {/* Search Input - Expands on Click */}
                    <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48' : 'w-5'}`}>
                        {isSearchOpen ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    if (searchQuery.trim()) {
                                        router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
                                        setIsSearchOpen(false)
                                    }
                                }}
                                className="w-full relative"
                            >
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search..."
                                    className="w-full pl-2 pr-8 py-1 text-xs border-b border-slate-300 focus:border-slate-900 outline-none bg-transparent placeholder:text-slate-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                />
                                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600">
                                    <Search className="h-3 w-3" />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-slate-900 hover:text-rose-600 transition-colors"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden lg:flex items-center gap-4 border-r border-gray-200 pr-4 mr-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-serif font-bold hover:bg-rose-600 transition-colors shadow-sm ring-2 ring-transparent hover:ring-rose-100"
                                >
                                    {user.email?.charAt(0).toUpperCase() || 'U'}
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                                            <p className="text-sm font-medium text-slate-900 truncate" title={user.email}>{user.email}</p>
                                        </div>
                                        {/* Optional: Add Profile/Orders links here later */}
                                        <button
                                            type="button"
                                            onClick={() => signOut()}
                                            className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="text-slate-900 hover:text-rose-600 transition-colors" title="Login / Sign Up">
                                <User className="h-5 w-5" />
                            </Link>
                        )}
                    </div>

                    <div className="hidden lg:flex items-center gap-5">
                        <Link href="/wishlist" className="relative text-slate-900 hover:text-rose-600 transition-colors">
                            <Heart className="h-5 w-5" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-rose-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    <button className="relative text-slate-900 hover:text-rose-600 transition-colors" onClick={() => setIsOpen(true)}>
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-rose-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Bottom Row: Navigation Links (Desktop Only) */}
            <div className="hidden lg:flex justify-center items-center gap-14 py-4 border-t border-gray-50">
                <Link href="/category/easy-glam" className="text-xs font-bold text-slate-900 uppercase tracking-[0.25em] hover:text-rose-700 transition-colors">Easy Glam</Link>
                <Link href="/category/formal-edit" className="text-xs font-bold text-slate-900 uppercase tracking-[0.25em] hover:text-rose-700 transition-colors">Formal Edit</Link>
                <Link href="/category/wedding-edit" className="text-xs font-bold text-slate-900 uppercase tracking-[0.25em] hover:text-rose-700 transition-colors">Wedding Edit</Link>
                <Link href="/category/luxury-unstitched" className="text-xs font-bold text-slate-900 uppercase tracking-[0.25em] hover:text-rose-700 transition-colors">Unstitched</Link>
                <Link href="/products" className="text-xs font-bold text-slate-900 uppercase tracking-[0.25em] hover:text-rose-700 transition-colors">Shop All</Link>
                {showAdminLink && (
                    <Link href="/admin" className="text-xs font-bold text-white bg-slate-900 px-3 py-1 uppercase tracking-[0.25em] hover:bg-slate-700 transition-colors">Admin</Link>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white text-slate-900 border-t border-gray-100 absolute top-full left-0 w-full p-6 shadow-xl animate-in slide-in-from-top-2 z-40">
                    <div className="flex flex-col space-y-6 text-center">
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-rose-600">Home</Link>
                        <Link href="/category/easy-glam" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-rose-600">Easy Glam</Link>
                        <Link href="/category/formal-edit" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-rose-600">Formal Edit</Link>
                        <Link href="/category/wedding-edit" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-rose-600">Wedding Edit</Link>
                        <Link href="/category/luxury-unstitched" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-rose-600">Unstitched</Link>
                        <hr className="border-gray-100" />
                        <div className="flex justify-center gap-8">
                            <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium uppercase tracking-widest flex items-center gap-2 hover:text-rose-600">
                                <Heart className="h-4 w-4" /> Wishlist
                            </Link>
                            {user ? (
                                <button onClick={() => { signOut(); setIsMenuOpen(false) }} className="text-sm font-medium uppercase tracking-widest flex items-center gap-2 hover:text-rose-600">
                                    <User className="h-4 w-4" /> Logout
                                </button>
                            ) : (
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium uppercase tracking-widest flex items-center gap-2 hover:text-rose-600">
                                    <User className="h-4 w-4" /> Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
