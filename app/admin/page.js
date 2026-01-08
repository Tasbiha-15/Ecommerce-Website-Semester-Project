"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Banknote, ShoppingBag, AlertTriangle, Users, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminOverview() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard/stats')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setStats(data)
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500"></div>
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin-reverse opacity-70"></div>
            </div>
        </div>
    )

    if (!stats) return (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
            <div className="text-center">
                <p className="text-slate-500">No dashboard data available</p>
            </div>
        </div>
    )

    // Safe data with fallback to empty arrays
    const chartData = Array.isArray(stats.recentOrders) ? stats.recentOrders : []
    const hasChartData = chartData.length > 0
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-serif">Overview</h1>
                    <p className="text-slate-500 mt-1">Snapshot of your inventory performance.</p>
                </div>
                <Link href="/admin/products?new=true">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-300 transition-all rounded-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {/* StockMate Style KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Products</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-violet-50 flex items-center justify-center">
                            <ShoppingBag className="h-4 w-4 text-violet-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.productCount || 0}</div>
                        <p className="text-xs text-emerald-600 font-medium mt-1">+2 from last week</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-500">Low Stock Alerts</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-rose-50 flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-rose-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.lowStockCount || 0}</div>
                        <div className="flex items-center mt-1">
                            <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">Action required</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Value</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Banknote className="h-4 w-4 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">PKR {stats.inventoryValue?.toLocaleString() || '0'}</div>
                        <p className="text-xs text-slate-400 mt-1">Estimated asset value</p>
                    </CardContent>
                </Card>


            </div>

            {/* Charts Section - Clean White */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Sales Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        {hasChartData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <XAxis
                                        dataKey="created_at"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `PKR ${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value) => [`PKR ${value}`, 'Amount']}
                                    />
                                    <Line type="monotone" dataKey="total_amount" stroke="#0f172a" strokeWidth={3} dot={{ fill: '#0f172a', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-slate-400 text-sm">No sales data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {hasChartData ? (
                                <>
                                    {chartData.slice(0, 4).map((order, index) => (
                                        <div key={order.id || index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <ShoppingBag className="h-5 w-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">Order #{order.id?.slice(0, 6) || 'N/A'}</p>
                                                    <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-600">+PKR {order.total_amount}</span>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full text-slate-600 hover:text-slate-900 hover:border-slate-300">View All</Button>
                                </>
                            ) : (
                                <p className="text-slate-400 text-sm text-center py-8">No recent transactions</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
