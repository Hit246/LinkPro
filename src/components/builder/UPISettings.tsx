'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface UPIData {
    upiId: string
    upiLabel: string
}

export function UPISettings() {
    const [upi, setUpi] = useState<UPIData>({
        upiId: '',
        upiLabel: 'Support me',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    async function fetchProfile() {
        try {
            const response = await fetch('/api/profile')
            const data = await response.json()
            if (data.data) {
                setUpi({
                    upiId: data.data.upiId || '',
                    upiLabel: data.data.upiLabel || 'Support me',
                })
            }
        } catch (err) {
            setError('Failed to load UPI settings')
        } finally {
            setLoading(false)
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess(false)

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(upi),
            })

            const data = await response.json()
            if (!response.ok) {
                setError(data.error)
                return
            }

            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError('Failed to save UPI settings')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 rounded-lg bg-white p-6 shadow">
                <p className="text-gray-600">Loading UPI settings...</p>
            </div>
        )
    }

    return (
        <form
            onSubmit={handleSave}
            className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
            {/* HEADER */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Support / UPI
                </h2>
                <p className="text-sm text-gray-500">
                    Let your audience support you via UPI
                </p>
            </div>

            {/* STATUS */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    UPI settings saved successfully
                </div>
            )}

            {/* INPUTS */}
            <div className="space-y-5">

                {/* UPI ID */}
                <div>
                    <label className="text-sm font-medium text-gray-600">
                        UPI ID
                    </label>

                    <Input
                        type="text"
                        value={upi.upiId}
                        onChange={(e) =>
                            setUpi({ ...upi, upiId: e.target.value })
                        }
                        placeholder="yourname@upi"
                        className="mt-2 focus:ring-2 focus:ring-blue-500"
                    />

                    <p className="mt-1 text-xs text-gray-400">
                        Example: yourname@paytm or yourname@phonepe
                    </p>
                </div>

                {/* LABEL */}
                <div>
                    <label className="text-sm font-medium text-gray-600">
                        Button Label
                    </label>

                    <Input
                        type="text"
                        value={upi.upiLabel}
                        onChange={(e) =>
                            setUpi({ ...upi, upiLabel: e.target.value })
                        }
                        placeholder="Support me"
                        className="mt-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* 🔥 LIVE PREVIEW */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="mb-3 text-sm font-medium text-gray-600">
                    Preview
                </p>

                <button
                    disabled={!upi.upiId}
                    className={`w-full rounded-xl p-4 font-semibold transition ${upi.upiId
                            ? 'border-2 border-green-500 text-green-600 hover:bg-green-50'
                            : 'border border-gray-300 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {upi.upiLabel || 'Support me'}
                </button>

                {!upi.upiId && (
                    <p className="mt-2 text-xs text-gray-400 text-center">
                        Enter UPI ID to enable
                    </p>
                )}
            </div>

            {/* ACTION */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                    This button will appear on your public profile
                </p>

                <Button
                    type="submit"
                    disabled={saving || !upi.upiId}
                    className="rounded-xl px-6"
                >
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    )
}
