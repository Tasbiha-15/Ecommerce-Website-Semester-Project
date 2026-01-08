"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-600 mb-6">There was a problem signing you in. Please try again.</p>
            <Link href="/login">
                <Button>Return to Login</Button>
            </Link>
        </div>
    )
}
