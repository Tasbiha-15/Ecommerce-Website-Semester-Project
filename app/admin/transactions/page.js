"use client"
import { useState, useEffect } from 'react'
import { Download, Search, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { toast } from 'react-hot-toast'

export default function TransactionsLedger() {
    const [transactions, setTransactions] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTransactions(data)
                setLoading(false)
            })
            .catch(() => {
                toast.error("Failed to load transactions")
                setLoading(false)
            })
    }, [])

    const filtered = transactions.filter(t =>
        (t.products?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.type || '').toLowerCase().includes(search.toLowerCase())
    )

    const downloadCSV = () => {
        const headers = ['Date', 'Type', 'Product', 'SKU', 'Quantity', 'Total Price', 'Order Ref']
        const rows = filtered.map(t => [
            new Date(t.created_at).toLocaleString(),
            t.type,
            t.products?.name,
            t.products?.sku,
            t.quantity,
            t.total_price,
            t.orders?.full_name || '-'
        ])

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions_ledger.csv");
        document.body.appendChild(link);
        link.click();
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 font-serif tracking-tight">Master Ledger</h1>
                <Button onClick={downloadCSV} className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                </Button>
            </div>

            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            placeholder="Search transactions..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500/20 outline-none"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Quantity</th>
                                    <th className="px-4 py-3">Value</th>
                                    <th className="px-4 py-3">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase
                                         ${(t.type === 'sale' || t.type === 'order') ? 'bg-indigo-100 text-indigo-700' :
                                                    t.type === 'restock' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}
                                       `}>
                                                {t.type === 'sale' ? 'Order' : t.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {t.products?.name || 'Unknown Product'}
                                            <div className="text-xs text-gray-400">{t.products?.sku}</div>
                                        </td>
                                        <td className="px-4 py-3 font-mono">{Math.abs(t.quantity)}</td>
                                        <td className="px-4 py-3 font-mono">PKR {t.total_price || '0.00'}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {t.orders?.full_name ? `Order: ${t.orders.full_name}` : 'Manual'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                <FileText className="h-10 w-10 text-gray-300 mb-2" />
                                No transactions found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
