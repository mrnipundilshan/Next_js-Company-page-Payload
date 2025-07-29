'use client'

import React, { useState } from 'react'
import './css/CreatePostForm.css'

type CreatePostFormProps = object

const CreatePostForm: React.FC<CreatePostFormProps> = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
  })
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setBackgroundImage(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // First, upload the image if provided
      let mediaId = null
      if (backgroundImage) {
        const imageFormData = new FormData()
        imageFormData.append('file', backgroundImage)

        const uploadResponse = await fetch('/api/media', {
          method: 'POST',
          body: imageFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadResult = await uploadResponse.json()
        mediaId = uploadResult.doc.id
      }

      // Create the post
      const postData = {
        'Project Name': formData.projectName,
        'Project Description': [
          {
            type: 'paragraph',
            children: [
              {
                text: formData.projectDescription,
              },
            ],
          },
        ],
        ...(mediaId && { backgroundImage: mediaId }),
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      setMessage('Project created successfully!')
      setFormData({ projectName: '', projectDescription: '' })
      setBackgroundImage(null)

      // Reset file input
      const fileInput = document.getElementById('backgroundImage') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      // Refresh the page to show the new post
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Error creating post:', error)
      setMessage('Error creating project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-post-form-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="projectName">Project Name *</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            required
            placeholder="Enter project name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectDescription">Project Description *</label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
            required
            placeholder="Enter project description"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="backgroundImage">Background Image *</label>
          <input
            type="file"
            id="backgroundImage"
            name="backgroundImage"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
          <small>Accepted formats: JPG, PNG, GIF, WebP</small>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>
    </div>
  )
}

export default CreatePostForm
