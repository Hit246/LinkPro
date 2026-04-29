import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/session'
import { cloudinary } from '@/lib/cloudinary'
import { Buffer } from 'buffer'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { data: null, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { data: null, error: 'No file provided' },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buf = Buffer.from(bytes)

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'linkpro/avatars',
                    resource_type: 'auto',
                    width: 256,
                    height: 256,
                    crop: 'thumb',
                    gravity: 'face',
                },
                (error: any, result: any) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )

                ; (uploadStream as any).on('error', reject)
                ; (uploadStream as any).end(buf)
        })

        return NextResponse.json({ data: result, error: null }, { status: 201 })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { data: null, error: 'Failed to upload image' },
            { status: 500 }
        )
    }
}
