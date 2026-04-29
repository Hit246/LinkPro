import { NextResponse } from 'next/server'
import { auth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { data: null, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get profile
        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
        })

        if (!profile) {
            return NextResponse.json(
                { data: null, error: 'Profile not found' },
                { status: 404 }
            )
        }

        // Get 14-day analytics
        const fourteenDaysAgo = new Date()
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

        // Total metrics
        const events = await prisma.analyticsEvent.findMany({
            where: {
                profileId: profile.id,
                createdAt: { gte: fourteenDaysAgo },
            },
        })

        const totalPageViews = events.filter((e: any) => e.eventType === 'page_view').length
        const totalLinkClicks = events.filter((e: any) => e.eventType === 'link_click').length
        const totalUPIClicks = events.filter((e: any) => e.eventType === 'upi_click').length
        const mobileVisits = events.filter((e: any) => e.device === 'mobile').length
        const desktopVisits = events.filter((e: any) => e.device === 'desktop').length

        // Daily breakdown for chart (last 14 days)
        const dailyData: Record<string, number> = {}
        for (let i = 0; i < 14; i++) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            dailyData[dateStr] = 0
        }

        events.forEach((event: any) => {
            if (event.eventType === 'page_view') {
                const dateStr = event.createdAt.toISOString().split('T')[0]
                if (dateStr in dailyData) {
                    dailyData[dateStr]++
                }
            }
        })

        const chartData = Object.entries(dailyData)
            .reverse()
            .map(([date, views]) => ({
                date: new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                }),
                views,
            }))

        // Per-link stats
        const links = await prisma.link.findMany({
            where: { profileId: profile.id },
            orderBy: { position: 'asc' },
        })

        const linkStats = await Promise.all(
            links.map(async (link: any) => {
                const clicks = events.filter(
                    (e: any) => e.eventType === 'link_click' && e.linkId === link.id
                ).length
                return {
                    linkId: link.id,
                    title: link.title,
                    url: link.url,
                    clicks,
                }
            })
        )

        return NextResponse.json({
            data: {
                totalPageViews,
                totalLinkClicks,
                totalUPIClicks,
                mobileVisits,
                desktopVisits,
                chartData,
                linkStats,
            },
            error: null,
        })
    } catch (error) {
        console.error('GET analytics error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
