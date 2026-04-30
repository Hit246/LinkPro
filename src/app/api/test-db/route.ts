// src/app/api/test-db/route.ts

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const result = await prisma.user.findFirst()

        return NextResponse.json({
            success: true,
            data: result,
        })
    } catch (error) {
        console.error("DB ERROR:", error)

        return NextResponse.json({
            success: false,
            error: String(error),
        })
    }
}