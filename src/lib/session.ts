// src/lib/session.ts (create this)

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function auth() {
    return await getServerSession(authOptions)
}