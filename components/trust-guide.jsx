"use client"

export default function TrustGuide() {
  return (
    <div className="trust-guide">
      <div className="guide-header">
        <h2 className="guide-title">Why This Matters</h2>
        <p className="guide-subtitle">Understanding the importance of fact-checking in today's digital world</p>
      </div>

      <div className="trust-sections">
        {/* The Problem Section */}
        <section className="trust-section">
          <div className="section-icon">⚠️</div>
          <h3 className="section-title">The Crisis of Misinformation</h3>
          <p className="section-text">
            In today's digital age, false information spreads faster than ever. Studies show that misinformation can
            reach millions of people within hours, influencing opinions, decisions, and even elections. The average
            person encounters dozens of claims daily—many of which are partially or completely false.
          </p>
          <div className="stat-box">
            <p className="stat-number">92%</p>
            <p className="stat-label">of people struggle to identify fake news</p>
          </div>
        </section>

        {/* Why It Matters Section */}
        <section className="trust-section">
          <div className="section-icon">🎯</div>
          <h3 className="section-title">Why Fact-Checking Matters</h3>
          <p className="section-text">
            Misinformation can have serious real-world consequences. It affects public health decisions, financial
            choices, relationships, and democratic processes. By fact-checking claims before sharing them, you become
            part of the solution—helping to create a more informed and trustworthy information ecosystem.
          </p>
          <div className="impact-list">
            <div className="impact-item">
              <span className="impact-icon">✓</span>
              <span>Protects yourself and others from harmful misinformation</span>
            </div>
            <div className="impact-item">
              <span className="impact-icon">✓</span>
              <span>Helps maintain trust in credible sources</span>
            </div>
            <div className="impact-item">
              <span className="impact-icon">✓</span>
              <span>Contributes to informed decision-making</span>
            </div>
            <div className="impact-item">
              <span className="impact-icon">✓</span>
              <span>Strengthens democratic discourse</span>
            </div>
          </div>
        </section>

        {/* How Our Tool Works Section */}
        <section className="trust-section">
          <div className="section-icon">🔍</div>
          <h3 className="section-title">How Our Fact-Checker Works</h3>
          <p className="section-text">
            Our tool uses advanced AI analysis to examine claims from multiple angles. It cross-references information,
            checks for logical consistency, and identifies common misinformation patterns. While no tool is 100%
            perfect, our system is designed to catch the most common types of false claims.
          </p>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Input Analysis</h4>
                <p>You provide a claim, image, or URL</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>AI Processing</h4>
                <p>Our system analyzes the information</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Verification</h4>
                <p>Cross-references with known facts</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Results</h4>
                <p>Get detailed analysis and confidence score</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Trust Us Section */}
        <section className="trust-section">
          <div className="section-icon">🛡️</div>
          <h3 className="section-title">Why You Can Trust This Tool</h3>
          <div className="trust-reasons">
            <div className="reason-card">
              <h4 className="reason-title">Transparent Analysis</h4>
              <p className="reason-text">
                We provide detailed explanations for our verdicts, not just a yes/no answer. You can understand the
                reasoning behind each assessment.
              </p>
            </div>
            <div className="reason-card">
              <h4 className="reason-title">Confidence Scores</h4>
              <p className="reason-text">
                Each result includes a confidence percentage, helping you understand how certain we are about the
                analysis.
              </p>
            </div>
            <div className="reason-card">
              <h4 className="reason-title">Multiple Input Methods</h4>
              <p className="reason-text">
                Check text claims, analyze images, or verify URLs. Our tool handles various types of misinformation.
              </p>
            </div>
            <div className="reason-card">
              <h4 className="reason-title">Trending Insights</h4>
              <p className="reason-text">
                See what false claims are spreading right now. Stay informed about current misinformation trends.
              </p>
            </div>
            <div className="reason-card">
              <h4 className="reason-title">Educational Resources</h4>
              <p className="reason-text">
                Learn how to identify fake news yourself. We empower you with knowledge, not just answers.
              </p>
            </div>
            <div className="reason-card">
              <h4 className="reason-title">Continuous Improvement</h4>
              <p className="reason-text">
                Our AI learns and improves over time, becoming better at detecting sophisticated misinformation.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="trust-section cta-section">
          <h3 className="section-title">Start Fact-Checking Today</h3>
          <p className="section-text">
            Don't let misinformation spread. Use our tool to verify claims before sharing them. Together, we can create
            a more informed and trustworthy digital world.
          </p>
          <button className="cta-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Go to Fact Checker
          </button>
        </section>
      </div>
    </div>
  )
}
