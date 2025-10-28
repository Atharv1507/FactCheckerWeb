"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import SearchBox from "@/components/search-box"
import ResultsDisplay from "@/components/results-display"
import TrendingFakes from "@/components/trending-fakes"
import EducationGuide from "@/components/education-guide"

export default function Home() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [trendingFakes, setTrendingFakes] = useState([])
  const [activeTab, setActiveTab] = useState("checker")

  const fetchTrendingFakes = async () => {
    try {
      const response = await fetch("/api/trending-fakes")

      if (!response.ok) {
        const text = await response.text()
        console.error("Server returned error:", response.status, text)
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      if (data.fakes) {
        setTrendingFakes(data.fakes)
        localStorage.setItem("trendingFakes", JSON.stringify(data.fakes))
      }
    } catch (error) {
      console.error("Failed to fetch trending fakes from server:", error)
      const stored = localStorage.getItem("trendingFakes")
      if (stored) {
        try {
          setTrendingFakes(JSON.parse(stored))
        } catch (e) {
          console.error("Failed to parse trending fakes from localStorage")
        }
      }
    }
  }

  useEffect(() => {
    fetchTrendingFakes()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTrendingFakes()
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const addToTrendingFakes = async (claim, analysis, timestamp) => {
    const newFake = {
      claim,
      confidence: analysis.confidence,
      summary: analysis.summary,
      timestamp,
    }

    try {
      const response = await fetch("/api/trending-fakes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fake: newFake }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      if (data.fakes) {
        setTrendingFakes(data.fakes)
        localStorage.setItem("trendingFakes", JSON.stringify(data.fakes))
      }
    } catch (error) {
      console.error("Failed to save trending fake to server:", error)
      setTrendingFakes((prev) => {
        const exists = prev.some((fake) => fake.claim === claim)
        if (exists) return prev

        const updated = [newFake, ...prev].slice(0, 10)
        localStorage.setItem("trendingFakes", JSON.stringify(updated))
        return updated
      })
    }
  }

  const removeFake = async (index) => {
    try {
      const response = await fetch("/api/trending-fakes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      if (data.fakes) {
        setTrendingFakes(data.fakes)
        localStorage.setItem("trendingFakes", JSON.stringify(data.fakes))
      }
    } catch (error) {
      console.error("Failed to remove trending fake from server:", error)
      setTrendingFakes((prev) => {
        const updated = prev.filter((_, i) => i !== index)
        localStorage.setItem("trendingFakes", JSON.stringify(updated))
        return updated
      })
    }
  }

  const handleSearch = async (query, image, url) => {
    if (!query.trim() && !image && !url.trim()) {
      setError("Please enter a search query, upload an image, or paste a URL")
      return
    }

    setSearchQuery(query || url || "Image analysis")
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      let imageData = null
      if (image) {
        const reader = new FileReader()
        imageData = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(image)
        })
      }

      const response = await fetch("/api/fact-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, image: imageData, url }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "An error occurred while fetching fact-check results.")
        setLoading(false)
        return
      }

      setResults(data)
      setLoading(false)

      if (data.analysis && data.analysis.verdict) {
        const verdict = data.analysis.verdict.toLowerCase()
        const confidence = data.analysis.confidence || 0

        if (verdict.includes("false") && confidence >= 60) {
          addToTrendingFakes(data.claim, data.analysis, data.timestamp)
        }
      }
    } catch (err) {
      console.error("Client Error:", err.message)

      let userMessage = err.message
      if (err.message.includes("Failed to fetch")) {
        userMessage = "Network connection failed. Please check your internet connection and try again."
      }

      setError(userMessage)
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="interactive-background">
        <div className="gradient-blob gradient-blob-1"></div>
        <div className="gradient-blob gradient-blob-2"></div>
        <div className="gradient-blob gradient-blob-3"></div>
        <div className="gradient-blob gradient-blob-4"></div>
      </div>

      <Header />
      <main className="main-content">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "checker" ? "active" : ""}`}
            onClick={() => setActiveTab("checker")}
          >
            Fact Checker
          </button>
          <button
            className={`tab-button ${activeTab === "education" ? "active" : ""}`}
            onClick={() => setActiveTab("education")}
          >
            Learn
          </button>
        </div>

        {activeTab === "checker" ? (
          <>
            <SearchBox onSearch={handleSearch} loading={loading} />
            {loading && (
              <div className="loading-container">
                <div className="thinking-loader">
                  <div className="thinking-orb"></div>
                  <div className="thinking-waves">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="wave" style={{ "--wave-delay": `${i * 0.3}s` }}></div>
                    ))}
                  </div>
                </div>
                <p className="loading-text">Mind is thinking...</p>
              </div>
            )}
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            {results && <ResultsDisplay results={results} />}

            <TrendingFakes fakes={trendingFakes} onRemove={removeFake} />
          </>
        ) : (
          <EducationGuide />
        )}
      </main>
    </div>
  )
}
