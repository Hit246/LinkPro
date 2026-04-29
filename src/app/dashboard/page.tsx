'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ProfileForm } from '@/components/builder/ProfileForm'
import { AvatarUpload } from '@/components/builder/AvatarUpload'
import { LinkList } from '@/components/builder/LinkList'
import { UPISettings } from '@/components/builder/UPISettings'
import { ProfileHeader } from '@/components/public-profile/ProfileHeader'
import { LinkButton } from '@/components/public-profile/LinkButton'

interface Profile {
    displayName: string
    bio: string
    avatarUrl?: string
    themeColor: string
    upiId?: string
    upiLabel?: string
}

interface Link {
    id: string
    title: string
    url: string
    icon: string
    isActive: boolean
}

export default function DashboardPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [links, setLinks] = useState<Link[]>([])
    const [activeTab, setActiveTab] = useState('editor')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
        if (status === 'authenticated') {
            fetchData()
        }
    }, [status, router])

    async function fetchData() {
        try {
            const [profileRes, linksRes] = await Promise.all([
                fetch('/api/profile'),
                fetch('/api/links'),
            ])

            const profileData = await profileRes.json()
            const linksData = await linksRes.json()

            if (profileData.data) setProfile(profileData.data)
            if (linksData.data) setLinks(linksData.data)
        } catch (err) {
            console.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-gray-600">Loading dashboard...</p>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-gray-600">Failed to load profile</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

            {/* HEADER */}
            <div className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            LinkPro Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">
                            @{session?.user?.username}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <a
                            href="/dashboard/analytics"
                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition"
                        >
                            Analytics
                        </a>

                        <a
                            href={`/${session?.user?.username}`}
                            target="_blank"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                        >
                            View Profile
                        </a>

                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE TABS */}
            <div className="flex gap-2 border-b border-gray-200 bg-white px-4 py-3 md:hidden">
                {['editor', 'preview'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === tab
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {tab === 'editor' ? 'Editor' : 'Preview'}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                    {/* LEFT: EDITOR */}
                    <div className={`md:col-span-2 ${activeTab === 'preview' ? 'hidden md:block' : ''}`}>
                        <div className="space-y-6">
                            <ProfileForm />
                            <AvatarUpload onUploadComplete={fetchData} />
                            <UPISettings />
                            <LinkList />
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW */}
                    <div className={`md:col-span-1 ${activeTab === 'editor' ? 'hidden md:block' : ''}`}>
                        <div className="sticky top-24 space-y-4">

                            <h2 className="text-lg font-semibold text-gray-800">
                                Live Preview
                            </h2>

                            {/* 🔥 PHONE FRAME */}
                            <div className="mx-auto w-[280px] rounded-[32px] border-[6px] border-black bg-black shadow-2xl">

                                <div className="h-[560px] overflow-y-auto rounded-[26px] bg-white">

                                    <div className="space-y-6 px-4 py-8">

                                        <ProfileHeader
                                            avatar={profile.avatarUrl}
                                            displayName={profile.displayName || 'Your Name'}
                                            bio={profile.bio || 'Add a bio to your profile'}
                                        />

                                        <div className="space-y-3">
                                            {links
                                                .filter((l) => l.isActive)
                                                .map((link) => (
                                                    <LinkButton
                                                        key={link.id}
                                                        title={link.title}
                                                        url={link.url}
                                                        icon={link.icon}
                                                    />
                                                ))}
                                        </div>

                                        {profile.upiId && (
                                            <button className="w-full rounded-xl border-2 border-green-500 p-4 text-center font-semibold text-green-600 hover:bg-green-50 transition">
                                                {profile.upiLabel || 'Support me'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-xs text-gray-500">
                                Real-time preview
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
