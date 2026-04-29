'use client'

import { useEffect } from 'react'
import { UPIButton } from '@/components/public-profile/UPIButton'

interface Link {
    id: string
    title: string
    url: string
    icon: string
    isActive: boolean
}

interface PublicProfileClientProps {
    profileId: string
    displayName: string
    bio?: string
    avatarUrl?: string
    upiId?: string
    upiLabel?: string
    links: Link[]
}

export default function PublicProfileClient({
    profileId,
    displayName,
    bio,
    avatarUrl,
    upiId,
    upiLabel,
    links,
}: PublicProfileClientProps) {
    // Track page view on mount
    useEffect(() => {
        const trackPageView = async () => {
            try {
                // Detect if device is mobile or desktop
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                const device = isMobile ? 'mobile' : 'desktop'

                // Send tracking with keepalive to ensure it completes
                await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        profileId,
                        eventType: 'page_view',
                        device,
                        referrer: document.referrer || null,
                    }),
                    keepalive: true,
                })
            } catch (error) {
                console.error('Failed to track page view:', error)
            }
        }

        trackPageView()
    }, [profileId])

    async function handleLinkClick(linkId: string, url: string) {
        try {
            // Detect device
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
            const device = isMobile ? 'mobile' : 'desktop'

            // Send tracking with keepalive before navigation
            await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileId,
                    linkId,
                    eventType: 'link_click',
                    device,
                    referrer: document.referrer || null,
                }),
                keepalive: true,
            })

            // Navigate after tracking is sent
            window.open(url, '_blank')
        } catch (error) {
            console.error('Failed to track link click:', error)
            // Still open the link even if tracking fails
            window.open(url, '_blank')
        }
    }

    return (
        <main className="min-h-screen bg-white">
            <div className="flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        {avatarUrl && (
                            <div className="mb-4 flex justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={avatarUrl}
                                    alt={displayName}
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                            </div>
                        )}
                        <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                        {bio && <p className="mt-2 text-gray-600">{bio}</p>}
                    </div>

                    <div className="space-y-3">
                        {links.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleLinkClick(link.id, link.url)}
                                className="block w-full rounded-lg border-2 border-gray-200 p-4 text-center font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {link.title}
                            </button>
                        ))}
                    </div>

                    {upiId && (
                        <UPIButton
                            upiId={upiId}
                            upiLabel={upiLabel || 'Support me'}
                            displayName={displayName}
                            profileId={profileId}
                        />
                    )}
                </div>
            </div>
        </main>
    )
}
