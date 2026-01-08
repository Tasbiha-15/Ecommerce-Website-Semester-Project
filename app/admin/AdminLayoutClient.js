"use client"
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Package, TrendingUp, LogOut, Search, User } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, signOut } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/admin/products?search=${encodeURIComponent(searchQuery)}`)
        }
    }

    const links = [
        { href: '/admin', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Inventory', icon: Package },
        { href: '/admin/transactions', label: 'Transactions', icon: TrendingUp },
    ]

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0f172a] border-r border-slate-800 hidden md:flex flex-col fixed inset-y-0 left-0 z-50 shadow-xl">
                <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
                    <h1 className="text-xl font-bold text-white tracking-widest font-serif uppercase">Maryum & Maria</h1>
                </div>

                <div className="flex-1 px-4 space-y-2 py-6">
                    <div className="mb-6 px-3">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Menu</h2>
                    </div>
                    {links.map(link => {
                        const Icon = link.icon
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-lg shadow-black/20"
                                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        )
                    })}
                </div>
                <div className="p-6 border-t border-slate-800/50">
                    <button onClick={signOut} className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/10 hover:text-white rounded-lg text-sm font-medium transition-colors mb-2">
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/10 hover:text-white rounded-lg text-sm font-medium transition-colors">
                        <LogOut className="h-5 w-5 rotate-180" />
                        Return Storefront
                    </Link>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 md:ml-64 flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40 shadow-sm">
                    <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-96 border border-slate-200 focus-within:ring-2 focus-within:ring-slate-300 transition-all">
                        <Search className="h-4 w-4 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-900 placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-serif font-bold hover:bg-rose-600 transition-colors shadow-sm ring-2 ring-transparent hover:ring-rose-100"
                                >
                                    {user.email?.charAt(0).toUpperCase() || 'A'}
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                                            <p className="text-sm font-medium text-slate-900 truncate" title={user.email}>{user.email}</p>
                                        </div>
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
                            <button className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
                                <User className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 pt-24 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </main>
            </div>
        </div>
    )
}
