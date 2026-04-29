'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setErrors({})
    setSuccess(false)

    const cleanData = {
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
    }

    // 🔥 client-side validation
    if (!/^[a-z0-9]{3,20}$/.test(cleanData.username)) {
        setErrors({ username: 'Only lowercase letters and numbers (3-20 chars)' })
        setLoading(false)
        return
    }

    if (cleanData.password.length < 8) {
        setErrors({ password: 'Password must be at least 8 characters' })
        setLoading(false)
        return
    }

    if (cleanData.password !== cleanData.confirmPassword) {
        setErrors({ confirmPassword: 'Passwords do not match' })
        setLoading(false)
        return
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanData),
        })

        const result = await response.json()

        if (!response.ok) {
            // 🔥 better error mapping
            if (result.error?.includes('Username')) {
                setErrors({ username: result.error })
            } else if (result.error?.includes('Email')) {
                setErrors({ email: result.error })
            } else {
                setErrors({ submit: result.error })
            }
            return
        }

        setSuccess(true)
        setTimeout(() => {
            router.push('/login?registered=true')
        }, 1500)
    } catch (err) {
        setErrors({ submit: 'Network error' })
    } finally {
        setLoading(false)
    }
}

    if (success) {
        return (
            <main className="min-h-screen bg-white">
                <div className="flex min-h-screen items-center justify-center px-4 py-12">
                    <div className="text-center">
                        <div className="mb-4 text-6xl">✓</div>
                        <h1 className="text-2xl font-bold text-gray-900">Account Created!</h1>
                        <p className="mt-2 text-gray-600">Redirecting to login...</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white">
            <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">LinkPro</h1>
                        <p className="mt-2 text-sm text-gray-600">Create your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errors.submit && (
                            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {errors.submit}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                placeholder="3-20 lowercase alphanumeric"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                }
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}
