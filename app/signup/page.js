"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { signUp } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await signUp(email, password)
            // AuthContext handles success toast but we also want to redirect if needed
            const params = new URLSearchParams(window.location.search)
            const next = params.get('next')
            if (next) {
                router.push(next)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0f172a]">
            {/* Deep Professional Background with Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-slate-900 font-black group-hover:scale-110 transition-transform">M</div>
                            <span className="text-xl font-bold text-white tracking-tight">Maryum & Maria</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-slate-400 text-sm">Join the premium fashion community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)] focus:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)] focus:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            className="w-full h-12 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-xl shadow-lg shadow-black/20 hover:shadow-black/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link href="/login" className="text-white hover:text-slate-300 font-semibold underline underline-offset-4 hover:decoration-slate-400 transition-all">
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
