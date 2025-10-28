"use client"

import { useEffect, useState } from "react"

export default function TrendingFakes({ fakes: initialFakes, onRemove }) {
  const [fakes, setFakes] = useState(initialFakes || [])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchTrendingFakes = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/trending-fakes")
        if (response.ok) {
          const data = await response.json()
          setFakes(data.fakes || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching trending fakes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchTrendingFakes()

    // Set up polling every 15 seconds
    const interval = setInterval(fetchTrendingFakes, 15000)

    return () => clearInterval(interval)
  }, [])

  const handleRemove = async (index) => {
    const fake = fakes[index]
    if (!fake) return

    try {
      const response = await fetch("/api/trending-fakes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: fake.claim }),
      })

      if (response.ok) {
        const data = await response.json()
        setFakes(data.fakes || [])
        if (onRemove) onRemove(index)
      }
    } catch (error) {
      console.error("[v0] Error removing fake:", error)
    }
  }

  return (
    <section className="trending-fakes-section">
      <div className="trending-fakes-container">
        <div className="trending-fakes-header">
          <div className="trending-header-content">
            <h2 className="trending-fakes-title">Trending Fakes Worldwide</h2>
            <p className="trending-fakes-subtitle">
              False claims detected by users around the globe {isLoading && "(updating...)"}
            </p>
          </div>
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">LIVE</span>
          </div>
        </div>

        {!fakes || fakes.length === 0 ? (
          <div className="trending-fakes-empty">
            <div className="empty-icon"></div>
            <p className="empty-message">No trending fakes yet</p>
            <p className="empty-submessage">Be the first to fact-check a claim and it will appear here for everyone!</p>
          </div>
        ) : (
          <div className="trending-fakes-list">
            {fakes.map((fake, index) => (
              <div key={`${fake.claim}-${index}`} className="trending-fake-item">
                <div className="fake-item-header">
                  <span className="fake-badge">FALSE</span>
                  <span className="fake-confidence">{fake.confidence}% Confidence</span>
                </div>
                <p className="fake-claim">"{fake.claim}"</p>
                <p className="fake-summary">{fake.summary}</p>
                <div className="fake-footer">
                  <span className="fake-timestamp">
                    {new Date(fake.timestamp).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
