import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { detectDevice } from '@/lib/detectDevice'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { profileId, linkId, eventType } = body

        if (!profileId || !eventType) {
            return NextResponse.json(
                { data: null, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const userAgent = request.headers.get('user-agent') || ''
        const device = detectDevice(userAgent)
        const country =
            request.headers.get('x-vercel-ip-country') ||
            request.headers.get('cf-ipcountry') ||
            'IN'
        const referrer = request.headers.get('referer')

        await prisma.analyticsEvent.create({
            data: {
                profileId,
                linkId: linkId || null,
                eventType,
                referrer,
                device,
                country,
            },
        })

        return NextResponse.json(
            { data: { tracked: true }, error: null },
            { status: 200 }
        )
    } catch (error) {
        console.error('Track event error:', error)
        // Always return 200 to not block user experience
        return NextResponse.json(
            { data: { tracked: true }, error: null },
            { status: 200 }
        )
    }
}
