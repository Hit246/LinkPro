import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

        if (!profile) {
            return NextResponse.json(
                { data: null, error: 'Profile not found' },
                { status: 404 }
            )
        }

        const links = await prisma.link.findMany({
            where: { profileId: profile.id },
            orderBy: { position: 'asc' },
        })

        return NextResponse.json({ data: links, error: null })
    } catch (error) {
        console.error('GET links error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to fetch links' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { data: null, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { title, url, icon } = body

        if (!title || !url) {
            return NextResponse.json(
                { data: null, error: 'Title and URL are required' },
                { status: 400 }
            )
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
        })

        if (!profile) {
            return NextResponse.json(
                { data: null, error: 'Profile not found' },
                { status: 404 }
            )
        }

        const maxPosition = await prisma.link.findFirst({
            where: { profileId: profile.id },
            orderBy: { position: 'desc' },
        })

        const link = await prisma.link.create({
            data: {
                profileId: profile.id,
                title,
                url,
                icon: icon || 'custom',
                position: (maxPosition?.position || 0) + 1,
            },
        })

        return NextResponse.json({ data: link, error: null }, { status: 201 })
    } catch (error) {
        console.error('POST link error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to create link' },
            { status: 500 }
        )
    }
}
