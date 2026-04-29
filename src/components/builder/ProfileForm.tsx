'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
]

interface Profile {
    displayName: string
    bio: string
    bioLanguage: string
    themeColor: string
}

export function ProfileForm() {
    const [profile, setProfile] = useState<Profile>({
        displayName: '',
        bio: '',
        bioLanguage: 'en',
        themeColor: '#000000',
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
                setProfile(data.data)
            }
        } catch (err) {
            setError('Failed to load profile')
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
                body: JSON.stringify(profile),
            })

            const data = await response.json()
            if (!response.ok) {
                setError(data.error)
                return
            }

            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError('Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 rounded-lg bg-white p-6 shadow">
                <p className="text-gray-600">Loading profile...</p>
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
                    Profile Settings
                </h2>
                <p className="text-sm text-gray-500">
                    Customize how your profile appears to others
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
                    Profile updated successfully
                </div>
            )}

            {/* BASIC INFO */}
            <div className="space-y-5">

                {/* NAME */}
                <div>
                    <label className="text-sm font-medium text-gray-600">
                        Display Name
                    </label>
                    <Input
                        type="text"
                        value={profile.displayName}
                        onChange={(e) =>
                            setProfile({ ...profile, displayName: e.target.value })
                        }
                        placeholder="Your name"
                        className="mt-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* BIO */}
                <div>
                    <div className="flex justify-between text-sm">
                        <label className="font-medium text-gray-600">
                            Bio
                        </label>
                        <span className="text-gray-400">
                            {profile.bio.length}/150
                        </span>
                    </div>

                    <textarea
                        value={profile.bio}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                bio: e.target.value.slice(0, 150),
                            })
                        }
                        rows={3}
                        className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell people about you..."
                    />
                </div>
            </div>

            {/* SETTINGS GRID */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* LANGUAGE */}
                <div>
                    <label className="text-sm font-medium text-gray-600">
                        Bio Language
                    </label>
                    <select
                        value={profile.bioLanguage}
                        onChange={(e) =>
                            setProfile({ ...profile, bioLanguage: e.target.value })
                        }
                        className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* THEME COLOR */}
                <div>
                    <label className="text-sm font-medium text-gray-600">
                        Theme Color
                    </label>

                    <div className="mt-2 flex items-center gap-3">

                        <div className="relative">
                            <input
                                type="color"
                                value={profile.themeColor}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        themeColor: e.target.value,
                                    })
                                }
                                className="h-12 w-16 cursor-pointer rounded-xl border"
                            />
                        </div>

                        <div className="flex-1 rounded-xl border px-3 py-2 text-sm text-gray-600">
                            {profile.themeColor}
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                    Changes are saved instantly after clicking save
                </p>

                <Button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl px-6"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    )
}
