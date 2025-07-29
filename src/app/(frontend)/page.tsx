/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'
import CreatePostForm from './CreatePostForm'
import DeletePostButton from './DeletePostButton'

// Helper function to render rich text content

function renderRichText(content: any): string {
  if (!content || !Array.isArray(content)) return ''

  return content
    .map((node: any) => {
      if (node.type === 'paragraph') {
        return node.children?.map((child: any) => child.text || '').join('') || ''
      }
      return ''
    })
    .join(' ')
}

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Authenticate user
  const { user } = await payload.auth({ headers })

  // Fetch posts
  const posts = await payload.find({
    collection: 'Posts',
    limit: 10,
  })

  return (
    <div className="home">
      <div className="content">
        <picture>
          <Image alt="Payload Logo" src="/media/logo.png" width={350} height={350} />
        </picture>
        {!user && <h1>Welcome to Admin Panel</h1>}
        {user && <h2>Welcome back to Admin Panel, {user.email}</h2>}

        <div className="links">
          <a
            className="admin"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
        </div>

        {/* Create Post Form */}
        <div className="create-post-section">
          <h2>Add New Project</h2>
          <CreatePostForm />
        </div>

        {/* Posts Section */}
        <div className="posts-section">
          <h2>Our Projects</h2>
          <div className="posts-grid">
            {posts.docs.map((post: any) => (
              <div key={post.id} className="post-card">
                {post.backgroundImage && (
                  <div className="post-image">
                    <Image
                      src={post.backgroundImage.url}
                      alt={post.backgroundImage.alt || post['Project Name']}
                      width={100}
                      height={100}
                      style={{ objectFit: 'scale-down' }}
                    />
                  </div>
                )}
                <div className="post-content">
                  <div className="post-header">
                    <h3>{post['Project Name']}</h3>
                    <DeletePostButton postId={post.id} />
                  </div>
                  <p>{renderRichText(post['Project Description'])}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
