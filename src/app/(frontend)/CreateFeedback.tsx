'use client'

import React, { useState } from 'react'
import './css/CreatePostForm.css'

type CreateFeedbackFormProps = object

const CreateFeedbackForm: React.FC<CreateFeedbackFormProps> = () => {
  const [formData, setFormData] = useState({
    ClientName: '',
    ClientFeedback: '',
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
        'Client Name': formData.ClientName,
        'Client Feedback': formData.ClientFeedback,
        ...(mediaId && { backgroundImage: mediaId }),
      }

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error('Failed to create feedback')
      }

      setMessage('Feedback created successfully!')
      setFormData({ ClientName: '', ClientFeedback: '' })
      setBackgroundImage(null)

      // Reset file input
      const fileInput = document.getElementById('backgroundImage') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      // Refresh the page to show the new post
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Error creating feedback:', error)
      setMessage('Error creating feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-post-form-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="projectName">Client Name *</label>
          <input
            type="text"
            id="ClientName"
            name="ClientName"
            value={formData.ClientName}
            onChange={handleInputChange}
            required
            placeholder="Enter client name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectDescription">Client Feedback *</label>
          <textarea
            id="ClientFeedback"
            name="ClientFeedback"
            value={formData.ClientFeedback}
            onChange={handleInputChange}
            required
            placeholder="Enter client feedback"
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

export default CreateFeedbackForm
