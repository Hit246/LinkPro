import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    if (process.env.NODE_ENV !== 'production') {
        return NextResponse.next()
    }

    const hostname = request.headers.get('host') || ''
    const parts = hostname.split('.')

    // If there's a subdomain (3+ parts) and it's not www
    if (parts.length > 2 && parts[0] !== 'www') {
        const subdomain = parts[0]
        return NextResponse.rewrite(new URL(`/${subdomain}${request.nextUrl.pathname}`, request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next|api).*)'],
}
