import { prisma } from './prisma'

interface TrackEventParams {
    profileId: string
    linkId?: string | null
    eventType: 'page_view' | 'link_click' | 'upi_click'
    referrer?: string | null
    device: 'mobile' | 'desktop'
    country?: string
}

export async function trackEvent({
    profileId,
    linkId,
    eventType,
    referrer,
    device,
    country = 'IN',
}: TrackEventParams) {
    try {
        await prisma.analyticsEvent.create({
            data: {
                profileId,
                linkId: linkId || null,
                eventType,
                referrer: referrer || null,
                device,
                country,
            },
        })
    } catch (error) {
        console.error('Analytics tracking error:', error)
        // Silently fail - never throw
    }
}
