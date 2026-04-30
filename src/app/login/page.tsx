'use client'

import { Suspense } from 'react'
import LoginForm from './LoginForm'

function LoginSkeleton() {
    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">LinkPro</h1>
                <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
            </div>
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <Suspense fallback={<LoginSkeleton />}>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    )
}
