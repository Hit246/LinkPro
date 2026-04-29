import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const USERNAME_REGEX = /^[a-z0-9]{3,20}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, username, password, confirmPassword } = body

        // Validation
        if (!email || !username || !password || !confirmPassword) {
            return NextResponse.json(
                { data: null, error: 'All fields are required' },
                { status: 400 }
            )
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { data: null, error: 'Invalid email format' },
                { status: 400 }
            )
        }

        if (!USERNAME_REGEX.test(username)) {
            return NextResponse.json(
                {
                    data: null,
                    error: 'Username must be 3-20 lowercase alphanumeric characters',
                },
                { status: 400 }
            )
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { data: null, error: 'Passwords do not match' },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { data: null, error: 'Password must be at least 8 characters' },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        })

        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json(
                    { data: null, error: 'Email already registered' },
                    { status: 400 }
                )
            }
            if (existingUser.username === username) {
                return NextResponse.json(
                    { data: null, error: 'Username already taken' },
                    { status: 400 }
                )
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user and profile
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                profile: {
                    create: {
                    },
                },
            },
            include: {
                profile: true,
            },
        })

        return NextResponse.json(
            {
                data: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                },
                error: null,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json(
            { data: null, error: 'An error occurred during registration' },
            { status: 500 }
        )
    }
}
