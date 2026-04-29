import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// ✅ PUT
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { data: null, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { title, url, icon, isActive } = body

        const link = await prisma.link.findUnique({
            where: { id },
            include: { profile: true },
        })

        if (!link) {
            return NextResponse.json(
                { data: null, error: 'Link not found' },
                { status: 404 }
            )
        }

        if (link.profile.userId !== session.user.id) {
            return NextResponse.json(
                { data: null, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const updatedLink = await prisma.link.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(url && { url }),
                ...(icon && { icon }),
                ...(isActive !== undefined && { isActive }),
            },
        })

        return NextResponse.json({ data: updatedLink, error: null })
    } catch (error) {
        console.error('PUT link error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to update link' },
            { status: 500 }
        )
    }
}

// ✅ DELETE
export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { data: null, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const link = await prisma.link.findUnique({
            where: { id },
            include: { profile: true },
        })

        if (!link) {
            return NextResponse.json(
                { data: null, error: 'Link not found' },
                { status: 404 }
            )
        }

        if (link.profile.userId !== session.user.id) {
            return NextResponse.json(
                { data: null, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await prisma.link.delete({
            where: { id },
        })

        return NextResponse.json({ data: null, error: null })
    } catch (error) {
        console.error('DELETE link error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to delete link' },
            { status: 500 }
        )
    }
}