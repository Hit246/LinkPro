'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { StatsCard } from '@/components/analytics/StatsCard'
import { ClicksChart } from '@/components/analytics/ClicksChart'
import { LinkStatsTable } from '@/components/analytics/LinkStatsTable'

interface AnalyticsData {
    totalPageViews: number
    totalLinkClicks: number
    totalUPIClicks: number
    mobileVisits: number
    desktopVisits: number
    chartData: Array<{
        date: string
        views: number
    }>
    linkStats: Array<{
        linkId: string
        title: string
        url: string
        clicks: number
    }>
}

export default function AnalyticsPage() {
    const router = useRouter()
    const { status } = useSession()
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
        if (status === 'authenticated') {
            fetchAnalytics()
        }
    }, [status, router])

    async function fetchAnalytics() {
        try {
            const response = await fetch('/api/analytics')
            const result = await response.json()
            if (result.data) {
                setData(result.data)
            }
        } catch (err) {
            console.error('Failed to load analytics')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-gray-600">Loading analytics...</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-gray-600">Failed to load analytics</p>
            </div>
        )
    }

    const mobilePercentage =
        data.totalPageViews > 0
            ? ((data.mobileVisits / data.totalPageViews) * 100).toFixed(0)
            : 0
    const desktopPercentage =
        data.totalPageViews > 0
            ? ((data.desktopVisits / data.totalPageViews) * 100).toFixed(0)
            : 0

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

            {/* HEADER */}
            <div className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

                    {/* LEFT: BACK + TITLE */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                        >
                            ← Back
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Analytics
                            </h1>
                            <p className="text-sm text-gray-500">Last 14 days</p>
                        </div>
                    </div>

                    {/* RIGHT: ACTION */}
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                        Dashboard
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8">

                {/* STATS */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <StatsCard title="Total Page Views" value={data.totalPageViews} />
                    <StatsCard title="Link Clicks" value={data.totalLinkClicks} />
                    <StatsCard
                        title="Device Split"
                        value={`${mobilePercentage}% Mobile`}
                        description={`${desktopPercentage}% Desktop`}
                    />
                    <StatsCard title="UPI Clicks" value={data.totalUPIClicks} />
                </div>

                {/* CHART + DEVICE */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* CHART */}
                    <div className="lg:col-span-2">
                        <ClicksChart data={data.chartData} />
                    </div>

                    {/* DEVICE CARD */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-6 text-lg font-semibold text-gray-900">
                            Device Breakdown
                        </h3>

                        <div className="space-y-5">

                            {/* MOBILE */}
                            <div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Mobile</span>
                                    <span className="font-semibold text-gray-900">
                                        {data.mobileVisits}
                                    </span>
                                </div>

                                <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                                        style={{ width: `${mobilePercentage}%` }}
                                    />
                                </div>
                            </div>

                            {/* DESKTOP */}
                            <div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Desktop</span>
                                    <span className="font-semibold text-gray-900">
                                        {data.desktopVisits}
                                    </span>
                                </div>

                                <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                                        style={{ width: `${desktopPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LINK STATS */}
                <div className="mt-8">
                    <LinkStatsTable data={data.linkStats} />
                </div>
            </div>
        </main>
    )
}
