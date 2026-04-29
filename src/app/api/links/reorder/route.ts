import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

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
        const { links } = body // Array of { id, position }

        if (!Array.isArray(links)) {
            return NextResponse.json(
                { data: null, error: 'Invalid request' },
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

        // Update all positions
        await Promise.all(
            links.map((link: { id: string; position: number }) =>
                prisma.link.update({
                    where: { id: link.id },
                    data: { position: link.position },
                })
            )
        )

        const updatedLinks = await prisma.link.findMany({
            where: { profileId: profile.id },
            orderBy: { position: 'asc' },
        })

        return NextResponse.json({ data: updatedLinks, error: null })
    } catch (error) {
        console.error('PUT reorder links error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to reorder links' },
            { status: 500 }
        )
    }
}
