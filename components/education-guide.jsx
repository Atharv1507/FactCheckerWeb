"use client"

import { useState } from "react"

export default function EducationGuide() {
  const [expandedTip, setExpandedTip] = useState(0)

  const tips = [
    {
      title: "Check the Source",
      description:
        "Verify the credibility of the source. Look for established news organizations with editorial standards, author bylines, and contact information.",
      examples: [
        "Reputable sources have clear author information",
        "Check if the publication has a history of fact-checking",
        "Look for 'About Us' pages with organizational details",
      ],
    },
    {
      title: "Look for Red Flags",
      description:
        "Be suspicious of sensational headlines, excessive punctuation, ALL CAPS text, or emotional language designed to provoke reactions.",
      examples: [
        "Avoid articles with clickbait headlines",
        "Watch for excessive exclamation marks or question marks",
        "Be wary of articles that seem designed to anger you",
      ],
    },
    {
      title: "Cross-Reference Information",
      description:
        "Check if multiple credible sources report the same information. If only one source has a story, it might not be verified.",
      examples: [
        "Search for the same story on multiple news sites",
        "Use Google News to see how widely a story is covered",
        "Check fact-checking websites like Snopes or FactCheck.org",
      ],
    },
    {
      title: "Examine Images and Videos",
      description:
        "Images can be manipulated, taken out of context, or from different events. Use reverse image search to find the original source.",
      examples: [
        "Use Google Images reverse search",
        "Check the date and location metadata",
        "Look for signs of photo editing or manipulation",
      ],
    },
    {
      title: "Check Publication Dates",
      description:
        "Old news presented as current events is a common tactic. Always check when an article was published.",
      examples: [
        "Look for publication dates on articles",
        "Be suspicious of stories without dates",
        "Check if the story is being recycled from years ago",
      ],
    },
    {
      title: "Verify Quotes and Statistics",
      description:
        "Quotes can be taken out of context or misattributed. Statistics should come from credible sources with proper citations.",
      examples: [
        "Find the original source of quotes",
        "Check if statistics are from peer-reviewed studies",
        "Look for proper attribution and links to sources",
      ],
    },
    {
      title: "Understand Bias",
      description:
        "All sources have some bias. Recognize the perspective and look for balanced reporting that acknowledges multiple viewpoints.",
      examples: [
        "Read articles from different political perspectives",
        "Look for sources that cite opposing viewpoints",
        "Be aware of your own confirmation bias",
      ],
    },
    {
      title: "Check for Satire",
      description:
        "Some websites publish satirical content that can be mistaken for real news. Check if the site is known for satire.",
      examples: [
        "Familiar satire sites include The Onion and Babylon Bee",
        "Look for 'satire' labels on articles",
        "Check the 'About' page to see if satire is mentioned",
      ],
    },
  ]

  return (
    <div className="education-guide">
      <div className="guide-header">
        <h2 className="guide-title">How to Identify Fake News</h2>
        <p className="guide-subtitle">
          Learn practical strategies to spot misinformation and verify information online
        </p>
      </div>

      <div className="tips-container">
        {tips.map((tip, index) => (
          <div key={index} className="tip-card">
            <button className="tip-header-btn" onClick={() => setExpandedTip(expandedTip === index ? -1 : index)}>
              <div className="tip-header-content">
                <span className="tip-number">{index + 1}</span>
                <h3 className="tip-title">{tip.title}</h3>
              </div>
              <span className="tip-toggle">{expandedTip === index ? "−" : "+"}</span>
            </button>

            {expandedTip === index && (
              <div className="tip-content">
                <p className="tip-description">{tip.description}</p>
                <div className="tip-examples">
                  <h4 className="examples-title">Examples:</h4>
                  <ul className="examples-list">
                    {tip.examples.map((example, i) => (
                      <li key={i} className="example-item">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="guide-footer">
        <h3 className="footer-title">Remember:</h3>
        <p className="footer-text">
          Critical thinking is your best defense against misinformation. Take time to verify before sharing, and when in
          doubt, check multiple sources.
        </p>
      </div>
    </div>
  )
}
