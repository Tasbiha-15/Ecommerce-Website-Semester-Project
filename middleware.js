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

    let user = null
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        user = authUser
    } catch (e) {
        console.error('Middleware: Error fetching user:', e)
        // Treat as guest
    }

    // Helper to ensure cookies are carried over on redirect
    const redirect = (path) => {
        const redirectUrl = new URL(path, request.url)
        const myRedirect = NextResponse.redirect(redirectUrl)
        // Copy cookies from the supabase-response to the redirect-response
        response.cookies.getAll().forEach(cookie => {
            myRedirect.cookies.set(cookie.name, cookie.value, cookie)
        })
        return myRedirect
    }

    // Admin Protection Logic
    if (request.nextUrl.pathname.startsWith('/admin')) {
        console.log('Middleware: Checking Admin Access for path:', request.nextUrl.pathname)

        if (!user) {
            console.log('Middleware: No user found, redirecting to login')
            return redirect('/login')
        }

        console.log('Middleware: User found:', user.email)

        // 1. Hardcoded Email Bypass
        const allowedEmails = ['tasbiha125@gmail.com', 'tasbiha1215@gmail.com']
        if (allowedEmails.includes(user.email)) {
            console.log('Middleware: Email allowed (bypass)')
            return response
        }

        // 2. Database Role Check
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        console.log('Middleware: Profile Role:', profile?.role)

        if (profile?.role !== 'admin') {
            console.log('Middleware: Role mismatch, redirecting')
            return redirect('/login')
        }
    }

    // Checkout Protection Logic
    if (request.nextUrl.pathname.startsWith('/checkout')) {
        if (!user) {
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('next', '/checkout')

            // Re-implement redirect helper logic here since URL is dynamic
            const myRedirect = NextResponse.redirect(redirectUrl)
            response.cookies.getAll().forEach(cookie => {
                myRedirect.cookies.set(cookie.name, cookie.value, cookie)
            })
            return myRedirect
        }
    }

    // Optional: Redirect logged in user from /login to /
    if (request.nextUrl.pathname === '/login' && user) {
        return redirect('/')
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
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
