"use client"

import { useState } from "react"

export default function SearchBox({ onSearch, loading }) {
  const [input, setInput] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [urlInput, setUrlInput] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(input, image, urlInput)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  return (
    <section className="search-section">
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="image-upload-section">
            <label htmlFor="image-upload" className="image-upload-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Upload Image to Verify
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload-input"
              disabled={loading}
            />

            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="image-preview" />
                <button type="button" onClick={removeImage} className="remove-image-button" disabled={loading}>
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="url-input-wrapper">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="url-icon"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Or paste a URL to analyze..."
              className="url-input"
              disabled={loading}
            />
          </div>

          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a claim to fact-check..."
              className="search-input"
              disabled={loading}
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? "Checking..." : "Check"}
            </button>
          </div>
        </form>
        <p className="search-hint">Type any claim, upload an image, or paste a URL to verify</p>
      </div>
    </section>
  )
}
