'use client'

import React, { useState } from 'react'
import './DeletePostButton.css'

interface DeletePostButtonProps {
  postId: string
}

const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDelete = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true)
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      // Refresh the page to show updated posts
      window.location.reload()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting project. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowConfirmation(false)
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="delete-button-container">
      {showConfirmation ? (
        <div className="confirmation-dialog">
          <span className="confirmation-text">Delete this project?</span>
          <div className="confirmation-buttons">
            <button onClick={handleDelete} disabled={isDeleting} className="confirm-delete-btn">
              {isDeleting ? 'Deleting...' : 'Yes'}
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              No
            </button>
          </div>
        </div>
      ) : (
        <button onClick={handleDelete} className="delete-btn" title="Delete project">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default DeletePostButton
