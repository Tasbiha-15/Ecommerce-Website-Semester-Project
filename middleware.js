import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const path = request.nextUrl.pathname

    // Define protected paths and auth-related paths
    // We strictly check these to avoid blocking public pages (Home, Products, etc.)
    const isProtectedPath = path.startsWith('/admin') || path.startsWith('/checkout')
    const isAuthPath = path === '/login' || path === '/signup'

    // Only run expensive getUser for protected or auth paths
    // This allows public pages (landing, products) to load instantly without waiting for Supabase
    if (isProtectedPath || isAuthPath) {
        let user = null
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            user = authUser
        } catch (e) {
            // Error fetching user, treat as guest
        }

        // Helper to ensure cookies are carried over on redirect
        const redirect = (newPath) => {
            const redirectUrl = new URL(newPath, request.url)
            const myRedirect = NextResponse.redirect(redirectUrl)
            // Copy cookies from the supabase-response to the redirect-response
            response.cookies.getAll().forEach(cookie => {
                myRedirect.cookies.set(cookie.name, cookie.value, cookie)
            })
            return myRedirect
        }

        // Admin Protection Logic
        if (path.startsWith('/admin')) {
            if (!user) {
                return redirect('/login')
            }

            // 1. Hardcoded Email Bypass
            const allowedEmails = ['tasbiha125@gmail.com', 'tasbiha1215@gmail.com']
            if (allowedEmails.includes(user.email)) {
                return response
            }

            // 2. Database Role Check
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle()

            if (profile?.role !== 'admin') {
                return redirect('/login')
            }
        }

        // Checkout Protection Logic
        if (path.startsWith('/checkout')) {
            if (!user) {
                const redirectUrl = new URL('/login', request.url)
                redirectUrl.searchParams.set('next', '/checkout')

                // Manually construct redirect to preserve cookies
                const myRedirect = NextResponse.redirect(redirectUrl)
                response.cookies.getAll().forEach(cookie => {
                    myRedirect.cookies.set(cookie.name, cookie.value, cookie)
                })
                return myRedirect
            }
        }

        // Redirect logged in user from /login or /signup to /
        if (isAuthPath && user) {
            return redirect('/')
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images, fonts, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|tff|eot)$).*)',
    ],
}
