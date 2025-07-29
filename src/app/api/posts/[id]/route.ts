import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    // Delete the post
    await payload.delete({
      collection: 'Posts',
      id: id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 })
  }
}
