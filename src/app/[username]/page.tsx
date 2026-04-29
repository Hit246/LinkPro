import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PublicProfileClient from './PublicProfileClient'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params

    const user = await prisma.user.findUnique({
        where: { username },
        include: { profile: true },
    })

    if (!user?.profile?.isPublished) {
        return { title: 'Not Found' }
    }

    return {
        title: `${user.profile.displayName || user.username} - LinkPro`,
        description: user.profile.bio || 'Check out my links on LinkPro',
        openGraph: {
            title: `${user.profile.displayName || user.username} - LinkPro`,
            description: user.profile.bio || 'Check out my links on LinkPro',
            images: user.profile.avatarUrl
                ? [{ url: user.profile.avatarUrl }]
                : [],
        },
    }
}

export default async function PublicProfilePage({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params

    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            profile: {
                include: {
                    links: {
                        where: { isActive: true },
                        orderBy: { position: 'asc' },
                    },
                },
            },
        },
    })

    if (!user || !user.profile?.isPublished) {
        notFound()
    }

    return (
        <PublicProfileClient
            profileId={user.profile.id}
            displayName={user.profile.displayName || user.username}
            bio={user.profile.bio}
            avatarUrl={user.profile.avatarUrl}
            upiId={user.profile.upiId}
            upiLabel={user.profile.upiLabel}
            links={user.profile.links}
        />
    )
}