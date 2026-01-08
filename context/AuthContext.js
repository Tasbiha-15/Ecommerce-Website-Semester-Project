"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false) // EMERGENCY: Start false to prevent loop
    const router = useRouter()
    const ADMIN_EMAIL = 'tasbiha125@gmail.com'

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .maybeSingle()

                    setUser({ ...session.user, role: profile?.role || 'user' })
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error('Error checking session:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                try {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .maybeSingle()
                    setUser({ ...session.user, role: profile?.role || 'user' })
                } catch (e) {
                    console.error('Error fetching profile in auth change:', e)
                    setUser(session.user)
                }
            } else {
                setUser(null)
            }

            setLoading(false)
            if (_event === 'SIGNED_IN') {
                toast.success('Signed in successfully')
                router.refresh()
            }
            if (_event === 'SIGNED_IN') {
                toast.success('Signed in successfully')
                router.refresh()
            }
            // SIGNED_OUT handled explicitly in signOut function now to ensure button responsiveness
        })

        return () => subscription.unsubscribe()
    }, [router])

    const isAdmin = user?.role === 'admin'

    const signIn = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
    }

    const signUp = async (email, password) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            }
        })
        if (error) throw error
        toast.success('Check your email to confirm account!')
    }

    const signOut = async () => {
        try {
            await supabase.auth.signOut()
            setUser(null)
            toast.success('Signed out successfully')
            router.push('/') // Redirect to home page
            router.refresh()
        } catch (error) {
            console.error('Error signing out:', error)
            toast.error('Error signing out')
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, signOut }}>
            {loading ? (
                <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
