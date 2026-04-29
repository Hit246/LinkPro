'use client'

import { useState, useEffect } from 'react'
import { generateUPILink } from '@/lib/upi'
import { QrCode, X } from 'lucide-react'

interface UPIButtonProps {
    upiId: string
    upiLabel: string
    displayName: string
    profileId: string
}

export function UPIButton({ upiId, upiLabel, displayName, profileId }: UPIButtonProps) {
    const [isMobile, setIsMobile] = useState(false)
    const [showQR, setShowQR] = useState(false)
    const [qrCode, setQrCode] = useState<string>('')

    useEffect(() => {
        const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        setIsMobile(checkMobile)
    }, [])

    async function handleUPIClick() {
        try {
            // Track UPI click
            const device = isMobile ? 'mobile' : 'desktop'
            await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileId,
                    eventType: 'upi_click',
                    device,
                    referrer: document.referrer || null,
                }),
                keepalive: true,
            })
        } catch (error) {
            console.error('Failed to track UPI click:', error)
        }

        if (isMobile) {
            // Mobile: Direct UPI deep link
            const upiLink = generateUPILink({
                upiId,
                name: displayName,
                note: upiLabel,
            })
            window.open(upiLink, '_self')
        } else {
            // Desktop: Show QR code modal
            if (!qrCode) {
                try {
                    const QRCode = (await import('qrcode')) as any
                    const upiLink = generateUPILink({
                        upiId,
                        name: displayName,
                        note: upiLabel,
                    })
                    const code = await QRCode.toDataURL(upiLink, {
                        errorCorrectionLevel: 'H',
                        type: 'image/png',
                        quality: 0.95,
                        margin: 1,
                        width: 300,
                    })
                    setQrCode(code)
                } catch (error) {
                    console.error('Failed to generate QR code:', error)
                }
            }
            setShowQR(true)
        }
    }

    return (
        <>
            {/* BUTTON */}
            <button
                onClick={handleUPIClick}
                className="group w-full rounded-xl border border-green-500 bg-white p-4 font-semibold text-green-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                <div className="flex items-center justify-center gap-2">
                    <span>{upiLabel || 'Support me'}</span>
                    {!isMobile && <QrCode className="h-4 w-4 opacity-70" />}
                </div>
            </button>

            {/* MODAL */}
            {showQR && qrCode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Scan to Pay
                            </h2>

                            <button
                                onClick={() => setShowQR(false)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* QR */}
                        <div className="mt-6 flex justify-center">
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <img
                                    src={qrCode}
                                    alt="UPI QR Code"
                                    className="h-60 w-60"
                                />
                            </div>
                        </div>

                        {/* TEXT */}
                        <p className="mt-4 text-center text-sm text-gray-500">
                            Scan using Google Pay, PhonePe, Paytm or any UPI app
                        </p>

                        {/* CTA */}
                        <button
                            onClick={() => setShowQR(false)}
                            className="mt-6 w-full rounded-xl bg-gray-100 py-2 font-medium text-gray-800 hover:bg-gray-200 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
