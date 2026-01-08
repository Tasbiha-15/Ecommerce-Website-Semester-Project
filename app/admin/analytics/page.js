"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Package, AlertCircle } from 'lucide-react'

// Mock Data for Charts
// Fashion Data for Charts
const MOCK_SALES_BY_CATEGORY = [
    { name: 'Formal Edit', value: 450000 },
    { name: 'Wedding Edit', value: 850000 },
    { name: 'Easy Glam', value: 250000 },
    { name: 'Unstitched', value: 320000 },
    { name: 'Jewelry', value: 120000 },
]
AC
const MOCK_STOCK_TRENDS = [
    { name: 'Jan', stock: 120 },
    { name: 'Feb', stock: 110 },
    { name: 'Mar', stock: 130 },
    { name: 'Apr', stock: 90 },
    { name: 'May', stock: 85 },
    { name: 'Jun', stock: 100 },
]

const COLORS = ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'] // Slate Shades

export default function AnalyticsPage() {
    // In a real app, fetch these from /api/dashboard/analytics
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-serif">Analytics & Insights</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPI Cards */}
                <Card className="border-slate-100 shadow-sm bg-white rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Asset Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-serif font-bold text-slate-900">PKR 2.4M</div>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-wider">+12% vs last month</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm bg-white rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Critical Stock</CardTitle>
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-serif font-bold text-slate-900">4 Items</div>
                        <p className="text-[10px] text-rose-500 font-bold mt-1 uppercase tracking-wider">Restock Required</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm bg-white rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Order Value</CardTitle>
                        <Package className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-serif font-bold text-slate-900">PKR 18,500</div>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">-5% vs last week</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-violet-100 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-violet-900">Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_SALES_BY_CATEGORY}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" />
                                <XAxis dataKey="name" fontSize={12} stroke="#6b7280" />
                                <YAxis fontSize={12} stroke="#6b7280" prefix="PKR " />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ fill: '#eef2ff' }}
                                />
                                <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-violet-100 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-violet-900">Stock Velocity</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOCK_STOCK_TRENDS}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" />
                                <XAxis dataKey="name" fontSize={12} stroke="#6b7280" />
                                <YAxis fontSize={12} stroke="#6b7280" />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Line type="monotone" dataKey="stock" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#7c3aed', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
