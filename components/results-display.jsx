"use client"

export default function ResultsDisplay({ results }) {
  const getVerdictColor = (verdict) => {
    if (!verdict) return "#6b7280"
    const lowerVerdict = verdict.toLowerCase()

    if (lowerVerdict.includes("false")) {
      return "#ef4444"
    }
    if (lowerVerdict.includes("true")) {
      return "#10b981"
    }
    if (lowerVerdict.includes("mixed")) {
      return "#f59e0b"
    }
    return "#6b7280"
  }

  const getVerdictLabel = (verdict) => {
    if (!verdict) return "Unverified"
    const lowerVerdict = verdict.toLowerCase()
    if (lowerVerdict.includes("false")) return "False"
    if (lowerVerdict.includes("true")) return "True"
    if (lowerVerdict.includes("mixed")) return "Mixed/Misleading"
    return "Unverified"
  }

  const analysis = results.analysis || {}
  const verdict = analysis.verdict || "mixed"
  const confidence = analysis.confidence || 0
  const summary = analysis.summary || "No analysis available"
  const keyPoints = analysis.key_points || []
  const sourcesNeeded = analysis.sources_needed || []

  const verdictColor = getVerdictColor(verdict)
  const verdictLabel = getVerdictLabel(verdict)

  const calculateTruthScore = () => {
    const lowerVerdict = verdict.toLowerCase()
    if (lowerVerdict.includes("false")) {
      // If confidently false, truth score should be low
      return 100 - confidence
    } else if (lowerVerdict.includes("true")) {
      // If confidently true, truth score should be high
      return confidence
    } else {
      // Mixed/misleading stays around middle
      return confidence / 2 + 25
    }
  }

  const truthScore = calculateTruthScore()

  return (
    <section className="results-section">
      <div className="results-container">
        <div className="verdict-card" style={{ borderLeftColor: verdictColor }}>
          <div className="verdict-header">
            <h2 className="verdict-title">Fact-Check Analysis</h2>
          </div>

          <div className="truth-o-meter">
            <h3 className="truth-o-meter-title">Truth-O-Meter</h3>
            <div className="meter-container">
              <div className="meter-track">
                <div
                  className="meter-fill"
                  style={{
                    width: `${truthScore}%`,
                    backgroundColor: verdictColor,
                  }}
                >
                  <div className="meter-glow"></div>
                </div>
              </div>
              <div className="meter-labels">
                <span className="meter-label">0%</span>
                <span className="meter-label">25%</span>
                <span className="meter-label">50%</span>
                <span className="meter-label">75%</span>
                <span className="meter-label">100%</span>
              </div>
            </div>
            <div className="meter-info">
              <div className="verdict-badge" style={{ backgroundColor: verdictColor }}>
                {verdictLabel}
              </div>
              <span className="confidence-value">{confidence}% Confidence</span>
            </div>
          </div>

          <div className="verdict-content">
            <p className="claim-text">"{results.claim || "N/A"}"</p>
          </div>
        </div>

        <div className="analysis-card">
          <h3 className="section-title">Analysis Summary</h3>
          <p className="analysis-text">{summary}</p>
        </div>

        {keyPoints && keyPoints.length > 0 && (
          <div className="sources-card">
            <h3 className="section-title">Key Findings</h3>
            <div className="sources-list">
              {keyPoints.map((point, index) => (
                <div key={index} className="source-item">
                  <div className="source-header">
                    <span className="source-number">Point {index + 1}</span>
                  </div>
                  <p className="source-excerpt">{point}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {sourcesNeeded && sourcesNeeded.length > 0 && (
          <div className="related-card">
            <h3 className="section-title">Recommended Sources for Verification</h3>
            <div className="related-list">
              {sourcesNeeded.map((source, index) => (
                <div key={index} className="related-item">
                  <div className="related-dot"></div>
                  <p className="related-text">{source}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="analysis-card">
          <p className="analysis-text" style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
            Analysis performed on {new Date(results.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  )
}
