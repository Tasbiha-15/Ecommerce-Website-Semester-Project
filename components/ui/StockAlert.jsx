"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X } from 'lucide-react'

export default function StockAlert({ isOpen, onClose, message, availableStock, itemName }) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4"
            >
                <div className="bg-white border rounded-none shadow-lg p-4 flex items-start gap-4 ring-1 ring-black/5 relative after:absolute after:inset-y-0 after:left-0 after:w-1 after:bg-red-500">
                    <div className="bg-red-50 p-2 rounded-full shrink-0">
                        <Info className="h-5 w-5 text-red-600" />
                    </div>

                    <div className="flex-1 pt-0.5">
                        <h4 className="font-serif text-gray-900 font-medium mb-1">Stock Limit Reached</h4>
                        <p className="text-sm text-gray-600 leading-relaxed font-light">
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors shrink-0 -mt-1 -mr-1"
                        aria-label="Close alert"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
