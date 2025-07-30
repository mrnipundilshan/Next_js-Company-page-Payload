import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    // Create the post
    const post = await payload.create({
      collection: 'Feedback',
      data: body,
    })

    return NextResponse.json({ success: true, doc: post })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const posts = await payload.find({
      collection: 'Feedback',
      limit: 10,
    })

    return NextResponse.json({ success: true, docs: posts.docs })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 })
  }
}
