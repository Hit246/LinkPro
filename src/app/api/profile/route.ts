import { NextRequest, NextResponse } from 'next/server'
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

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
        })

        return NextResponse.json({ data: profile, error: null })
    } catch (error) {
        console.error('GET profile error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { data: null, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { displayName, bio, bioLanguage, themeColor, upiId, upiLabel, avatarUrl } = body

        const profile = await prisma.profile.update({
            where: { userId: session.user.id },
            data: {
                ...(displayName !== undefined && { displayName }),
                ...(bio !== undefined && { bio }),
                ...(bioLanguage && { bioLanguage }),
                ...(themeColor && { themeColor }),
                ...(upiId !== undefined && { upiId }),
                ...(upiLabel && { upiLabel }),
                ...(avatarUrl && { avatarUrl }),
            },
        })

        return NextResponse.json({ data: profile, error: null })
    } catch (error) {
        console.error('PUT profile error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}
