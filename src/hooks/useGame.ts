import { useState, useCallback, useEffect } from 'react'
import { GameState, Question, GameMode, Country } from '@/types'
import {
  getRandomCountry,
  getRandomCountries,
  getCountriesByLevel,
  getAllCountries
} from '@/data/countries'
import { playSuccessSound, playErrorSound } from '@/lib/sounds'

const GAME_MODES: GameMode[] = ['multiple-choice', 'type-answer', 'select-flag']

const STORAGE_KEY = 'countryFlags_gameState'
const CONFIDENCE_DECAY_RATE = 0.1 // Weight reduction per position beyond recent answers
const RECENT_ANSWERS_COUNT = 20 // Use last N answers with full weight

export const useGame = (
  initialLevel: number = 1,
  autoAdvanceDelay: number = 1500,
  enabledModes: Array<'multiple-choice' | 'type-answer' | 'select-flag'> = [
    'multiple-choice',
    'type-answer',
    'select-flag'
  ],
  enableSoundEffects: boolean = true,
  getCountryName: (code: string) => string = (code: string) => code
) => {
  const loadSavedState = (): Partial<GameState> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          score: parsed.score || 0,
          streak: parsed.streak || 0,
          questionsAnswered: parsed.questionsAnswered || 0,
          currentLevel: parsed.currentLevel || initialLevel,
          answerHistory: parsed.answerHistory || []
        }
      }
    } catch (e) {
      console.error('Failed to load saved state:', e)
    }
    return {
      score: 0,
      streak: 0,
      questionsAnswered: 0,
      currentLevel: initialLevel,
      answerHistory: []
    }
  }

  const savedState = loadSavedState()

  // Calculate confidence from answerHistory with decay applied
  // Decay: older answers have less weight, simulating forgetting over time
  // This naturally decreases confidence over time as older answers matter less
  const getConfidence = useCallback(
    (code: string, history: GameState['answerHistory']): number => {
      const countryAnswers = history.filter((h) => h.country.code === code)
      if (countryAnswers.length === 0) return 0

      // Apply decay: recent answers have full weight, older ones have reduced weight
      // This simulates confidence decreasing over time (forgetting)
      let weightedCorrect = 0
      let weightedTotal = 0

      countryAnswers.forEach((answer, index) => {
        // Position: 0 = most recent, higher = older
        const position = countryAnswers.length - index - 1

        // Recent answers (last N) have full weight, older ones decay
        let weight = 1.0
        if (position >= RECENT_ANSWERS_COUNT) {
          const decaySteps = position - RECENT_ANSWERS_COUNT + 1
          weight = Math.max(0, 1.0 - decaySteps * CONFIDENCE_DECAY_RATE)
        }

        weightedTotal += weight
        if (answer.correct) {
          weightedCorrect += weight
        }
      })

      if (weightedTotal === 0) return 0
      return (weightedCorrect / weightedTotal) * 100
    },
    []
  )

  const [gameState, setGameState] = useState<GameState>({
    currentLevel: savedState.currentLevel || initialLevel,
    score: savedState.score || 0,
    streak: savedState.streak || 0,
    questionsAnswered: savedState.questionsAnswered || 0,
    currentQuestion: null,
    feedback: null,
    answerHistory: savedState.answerHistory || []
  })

  const generateQuestion = useCallback(
    (level: number): Question => {
      // Get all countries for this level
      const levelCountries = getCountriesByLevel(level)

      // Calculate confidence for each country from answerHistory
      const countriesWithConfidence = levelCountries.map((country) => ({
        country,
        confidence: getConfidence(country.code, gameState.answerHistory)
      }))

      // Sort by confidence (lowest first) and get bottom 5
      countriesWithConfidence.sort((a, b) => a.confidence - b.confidence)
      const leastConfident = countriesWithConfidence.slice(0, 5)

      // Randomly select one from the 5 least confident
      const selected =
        leastConfident[Math.floor(Math.random() * leastConfident.length)]
      const country = selected.country

      let availableModes = [...enabledModes]

      // Fallback if all modes are disabled
      if (availableModes.length === 0) {
        availableModes = ['multiple-choice']
      }

      const mode =
        availableModes[Math.floor(Math.random() * availableModes.length)]

      if (mode === 'multiple-choice' || mode === 'select-flag') {
        const wrongAnswers = getRandomCountries(3, country.code)
        const options = [country, ...wrongAnswers]
          .map((c) =>
            mode === 'multiple-choice' ? getCountryName(c.code) : c.code
          )
          .sort(() => Math.random() - 0.5)

        return {
          country,
          mode,
          options
        }
      }

      return {
        country,
        mode
      }
    },
    [enabledModes, gameState.answerHistory, getConfidence, getCountryName]
  )

  const startGame = useCallback(
    (level: number) => {
      const question = generateQuestion(level)
      setGameState((prev) => ({
        ...prev,
        currentLevel: level,
        currentQuestion: question,
        feedback: null
      }))
    },
    [generateQuestion]
  )

  const submitAnswer = useCallback(
    (answer: string) => {
      if (!gameState.currentQuestion) return

      const { country, mode } = gameState.currentQuestion
      let isCorrect = false

      if (mode === 'multiple-choice') {
        const correctName = getCountryName(country.code)
        isCorrect =
          answer.toLowerCase().trim() === correctName.toLowerCase().trim()
      } else if (mode === 'type-answer') {
        const correctName = getCountryName(country.code)
        isCorrect =
          answer.toLowerCase().trim() === correctName.toLowerCase().trim()
      } else if (mode === 'select-flag') {
        isCorrect = answer === country.code
      }

      // Play sound effect if enabled
      if (enableSoundEffects) {
        if (isCorrect) {
          playSuccessSound()
        } else {
          playErrorSound()
        }
      }

      setGameState((prev) => {
        const newStreak = isCorrect ? prev.streak + 1 : 0
        const newScore = isCorrect ? prev.score + 1 : prev.score

        const newAnswerHistory = [
          ...prev.answerHistory,
          {
            country,
            correct: isCorrect,
            mode
          }
        ]

        return {
          ...prev,
          score: newScore,
          streak: newStreak,
          questionsAnswered: prev.questionsAnswered + 1,
          feedback: isCorrect ? 'correct' : 'incorrect',
          answerHistory: newAnswerHistory
        }
      })

      // Auto-advance to next question after configured delay only if correct
      if (isCorrect) {
        if (autoAdvanceDelay === 0) {
          // Instant advance if delay is 0
          const nextQuestion = generateQuestion(gameState.currentLevel)
          setGameState((prev) => ({
            ...prev,
            currentQuestion: nextQuestion,
            feedback: null
          }))
        } else {
          // Wait for configured delay
          setTimeout(() => {
            const nextQuestion = generateQuestion(gameState.currentLevel)
            setGameState((prev) => ({
              ...prev,
              currentQuestion: nextQuestion,
              feedback: null
            }))
          }, autoAdvanceDelay)
        }
      }
    },
    [
      gameState.currentQuestion,
      gameState.currentLevel,
      generateQuestion,
      autoAdvanceDelay,
      enableSoundEffects,
      getCountryName
    ]
  )

  const nextQuestion = useCallback(() => {
    const next = generateQuestion(gameState.currentLevel)
    setGameState((prev) => ({
      ...prev,
      currentQuestion: next,
      feedback: null
    }))
  }, [gameState.currentLevel, generateQuestion])

  const changeLevel = useCallback(
    (level: number) => {
      startGame(level)
    },
    [startGame]
  )

  // Initialize first question
  useEffect(() => {
    if (!gameState.currentQuestion) {
      startGame(gameState.currentLevel)
    }
  }, [startGame, gameState.currentQuestion, gameState.currentLevel])

  // Reload question if enabledModes changes and current question mode is no longer enabled
  useEffect(() => {
    if (
      gameState.currentQuestion &&
      !enabledModes.includes(gameState.currentQuestion.mode)
    ) {
      const next = generateQuestion(gameState.currentLevel)
      setGameState((prev) => ({
        ...prev,
        currentQuestion: next,
        feedback: null
      }))
    }
  }, [
    enabledModes,
    gameState.currentQuestion?.mode,
    gameState.currentLevel,
    generateQuestion
  ])

  // Get flags sorted by confidence (for modal)
  // For least confident (ascending=true): prioritize 0/n (asked but never correct) over not practiced
  const getFlagsByConfidence = useCallback(
    (ascending: boolean = true) => {
      const allCountries = getAllCountries()
      return allCountries
        .map((country) => {
          const countryAnswers = gameState.answerHistory.filter(
            (h) => h.country.code === country.code
          )
          const correct = countryAnswers.filter((a) => a.correct).length
          const total = countryAnswers.length

          return {
            country,
            confidence: getConfidence(country.code, gameState.answerHistory),
            data: { correct, total }
          }
        })
        .sort((a, b) => {
          if (ascending) {
            // Least confident: prioritize flags that were asked but never answered correctly (0/n)
            // over flags that were never practiced (0/0)

            // Both are 0/n (asked but never correct)
            if (
              a.data.total > 0 &&
              a.data.correct === 0 &&
              b.data.total > 0 &&
              b.data.correct === 0
            ) {
              return a.confidence - b.confidence // Sort by confidence if both are 0/n
            }

            // a is 0/n (asked but never correct), b is not practiced
            if (
              a.data.total > 0 &&
              a.data.correct === 0 &&
              b.data.total === 0
            ) {
              return -1 // a comes first
            }

            // a is not practiced, b is 0/n (asked but never correct)
            if (
              a.data.total === 0 &&
              b.data.total > 0 &&
              b.data.correct === 0
            ) {
              return 1 // b comes first
            }

            // Both are not practiced
            if (a.data.total === 0 && b.data.total === 0) {
              return 0 // Keep original order
            }

            // One is 0/n, the other has some correct answers - 0/n comes first
            if (
              a.data.total > 0 &&
              a.data.correct === 0 &&
              b.data.correct > 0
            ) {
              return -1 // a (0/n) comes first
            }
            if (
              a.data.correct > 0 &&
              b.data.total > 0 &&
              b.data.correct === 0
            ) {
              return 1 // b (0/n) comes first
            }

            // Both have some correct answers, sort by confidence
            return a.confidence - b.confidence
          } else {
            // Most confident: simple reverse sort
            return b.confidence - a.confidence
          }
        })
    },
    [gameState.answerHistory, getConfidence]
  )

  const resetGameState = useCallback(
    (options: { resetScore: boolean; resetProgress: boolean }) => {
      setGameState((prev) => {
        const newState: GameState = {
          ...prev,
          currentQuestion: null,
          feedback: null
        }

        if (options.resetScore) {
          newState.score = 0
          newState.streak = 0
          newState.questionsAnswered = 0
        }

        if (options.resetProgress) {
          newState.answerHistory = []
        }

        return newState
      })

      // Clear localStorage
      if (options.resetProgress) {
        localStorage.removeItem(STORAGE_KEY)
      } else if (options.resetScore) {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            parsed.score = 0
            parsed.streak = 0
            parsed.questionsAnswered = 0
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
          } catch (e) {
            console.error('Failed to update saved state:', e)
          }
        }
      }
    },
    []
  )

  return {
    gameState,
    startGame,
    submitAnswer,
    changeLevel,
    nextQuestion,
    getFlagsByConfidence,
    resetGameState
  }
}
