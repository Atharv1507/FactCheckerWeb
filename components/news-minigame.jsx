"use client"

import { useState, useEffect } from "react"

export default function NewsMinigame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [shuffledFacts, setShuffledFacts] = useState([])

  const facts = [
    {
      claim: "The Great Wall of China is visible from space with the naked eye.",
      isReal: false,
      explanation: "This is a common myth. The Great Wall is not visible from space without magnification.",
    },
    {
      claim: "Honey never spoils and can last indefinitely.",
      isReal: true,
      explanation: "Honey has a very low moisture content and high acidity, making it resistant to bacterial growth.",
    },
    {
      claim: "Humans only use 10% of their brains.",
      isReal: false,
      explanation: "We use virtually all parts of our brain, and most of the brain is active almost all the time.",
    },
    {
      claim: "The Eiffel Tower grows taller in summer due to thermal expansion.",
      isReal: true,
      explanation: "Metal expands when heated. The Eiffel Tower can grow up to 6 inches taller in hot weather.",
    },
    {
      claim: "Goldfish have a memory span of only 3 seconds.",
      isReal: false,
      explanation:
        "Goldfish can actually remember things for months and can be trained to recognize shapes and colors.",
    },
    {
      claim: "Bananas are berries, but strawberries are not.",
      isReal: true,
      explanation: "Botanically, bananas are berries while strawberries are aggregate fruits. Surprising but true!",
    },
    {
      claim: "Sharks are immune to cancer.",
      isReal: false,
      explanation: "Sharks can and do get cancer. This myth was popularized by a misinterpreted study.",
    },
    {
      claim: "A group of flamingos is called a 'flamboyance'.",
      isReal: true,
      explanation: "Yes! A flamboyance of flamingos is the correct collective noun for these pink birds.",
    },
    {
      claim: "Carrots improve your night vision.",
      isReal: false,
      explanation:
        "This myth was spread by the British during WWII to hide radar technology. Carrots contain vitamin A which supports normal vision, but don't enhance it.",
    },
    {
      claim: "Octopuses have three hearts.",
      isReal: true,
      explanation:
        "Octopuses have three hearts: two pump blood to the gills, and one pumps it to the rest of the body.",
    },
    {
      claim: "Shaving makes hair grow back thicker.",
      isReal: false,
      explanation:
        "Hair appears thicker after shaving because the blunt edge is more noticeable, but shaving doesn't change hair growth.",
    },
    {
      claim: "Penguins have knees.",
      isReal: true,
      explanation: "Penguins do have knees! They're hidden inside their body, which is why they appear to waddle.",
    },
    {
      claim: "Sugar makes children hyperactive.",
      isReal: false,
      explanation:
        "Multiple studies show sugar doesn't cause hyperactivity. The belief is likely due to the excitement of eating treats.",
    },
    {
      claim: "Diamonds are made from compressed coal.",
      isReal: false,
      explanation:
        "Most diamonds form from carbon deep in the Earth's mantle, not from coal. Coal rarely becomes diamond.",
    },
    {
      claim: "A cockroach can survive for a week without its head.",
      isReal: true,
      explanation:
        "Cockroaches can survive without a head for about a week because they breathe through spiracles and don't need a mouth to breathe.",
    },
    {
      claim: "Tomatoes are vegetables.",
      isReal: false,
      explanation: "Tomatoes are botanically fruits because they develop from the flower's ovary and contain seeds.",
    },
    {
      claim: "Polar bears have black skin under their white fur.",
      isReal: true,
      explanation:
        "Polar bear skin is actually black, which helps absorb heat from the sun. Their fur is transparent, appearing white.",
    },
    {
      claim: "Humans shed all their skin cells every month.",
      isReal: false,
      explanation:
        "Humans shed skin cells continuously, but it takes about 2-4 weeks to shed the entire outer layer, not one month.",
    },
    {
      claim: "The smell of rain is caused by bacteria.",
      isReal: true,
      explanation: "The smell comes from a compound called geosmin, produced by soil bacteria called actinomycetes.",
    },
    {
      claim: "Chameleons change color to match their surroundings.",
      isReal: false,
      explanation:
        "Chameleons change color primarily for communication and temperature regulation, not camouflage. They often fail to match their background.",
    },
  ]

  useEffect(() => {
    // Shuffle facts and select 5 random ones for each game
    const shuffled = [...facts].sort(() => Math.random() - 0.5).slice(0, 5)
    setShuffledFacts(shuffled)
  }, [])

  const handleAnswer = (isTrue) => {
    setSelectedAnswer(isTrue)
    setAnswered(true)

    const currentFact = shuffledFacts[currentQuestion]
    if (isTrue === currentFact.isReal) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion + 1 < shuffledFacts.length) {
      setCurrentQuestion(currentQuestion + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    } else {
      setGameOver(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
    setAnswered(false)
    setSelectedAnswer(null)
    const shuffled = [...facts].sort(() => Math.random() - 0.5).slice(0, 5)
    setShuffledFacts(shuffled)
  }

  if (shuffledFacts.length === 0) {
    return <div className="minigame-loading">Loading game...</div>
  }

  if (gameOver) {
    const percentage = Math.round((score / shuffledFacts.length) * 100)
    let resultMessage = ""
    let resultEmoji = ""

    if (percentage === 100) {
      resultMessage = "Perfect! You're a fact-checking expert!"
      resultEmoji = "🏆"
    } else if (percentage >= 80) {
      resultMessage = "Excellent! You have great critical thinking skills!"
      resultEmoji = "⭐"
    } else if (percentage >= 60) {
      resultMessage = "Good job! Keep learning to improve your skills!"
      resultEmoji = "👍"
    } else if (percentage >= 40) {
      resultMessage = "Not bad! Practice makes perfect!"
      resultEmoji = "📚"
    } else {
      resultMessage = "Keep learning! Fact-checking takes practice!"
      resultEmoji = "💪"
    }

    return (
      <div className="minigame-container">
        <div className="game-over-card">
          <div className="result-emoji">{resultEmoji}</div>
          <h2 className="result-title">Game Over!</h2>
          <div className="final-score">
            <span className="score-number">{score}</span>
            <span className="score-text">out of {shuffledFacts.length}</span>
          </div>
          <div className="score-percentage">{percentage}%</div>
          <p className="result-message">{resultMessage}</p>
          <button className="restart-button" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      </div>
    )
  }

  const currentFact = shuffledFacts[currentQuestion]
  const isCorrect = selectedAnswer === currentFact.isReal

  return (
    <div className="minigame-container">
      <div className="game-header">
        <h2 className="game-title">Fact or Fake?</h2>
        <div className="game-progress">
          <span className="progress-text">
            Question {currentQuestion + 1} of {shuffledFacts.length}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / shuffledFacts.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="game-card">
        <div className="question-container">
          <p className="question-text">{currentFact.claim}</p>
        </div>

        {!answered ? (
          <div className="answer-buttons">
            <button className="answer-button false-button" onClick={() => handleAnswer(false)}>
              <span className="button-label">False</span>
              <span className="button-icon">✗</span>
            </button>
            <button className="answer-button true-button" onClick={() => handleAnswer(true)}>
              <span className="button-label">True</span>
              <span className="button-icon">✓</span>
            </button>
          </div>
        ) : (
          <div className={`feedback-container ${isCorrect ? "correct" : "incorrect"}`}>
            <div className="feedback-header">
              <span className="feedback-icon">{isCorrect ? "✓" : "✗"}</span>
              <span className="feedback-text">{isCorrect ? "Correct!" : "Incorrect!"}</span>
            </div>
            <div className="explanation-box">
              <p className="explanation-title">The Truth:</p>
              <p className="explanation-text">{currentFact.explanation}</p>
            </div>
            <button className="next-button" onClick={handleNext}>
              {currentQuestion + 1 === shuffledFacts.length ? "See Results" : "Next Question"}
            </button>
          </div>
        )}

        <div className="score-display">
          <span className="current-score">Score: {score}</span>
        </div>
      </div>
    </div>
  )
}
