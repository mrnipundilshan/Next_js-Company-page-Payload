import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create the media document
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: file.name,
      },
      file: {
        data: buffer,
        name: file.name,
        mimetype: file.type,
        size: 0,
      },
    })

    return NextResponse.json({ success: true, doc: media })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload media' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const media = await payload.find({
      collection: 'media',
      limit: 50,
    })

    return NextResponse.json({ success: true, docs: media.docs })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch media' }, { status: 500 })
  }
}
