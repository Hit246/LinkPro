import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'LinkPro - Link in Bio for Indian Creators',
    description: 'Create your beautiful link-in-bio landing page',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
