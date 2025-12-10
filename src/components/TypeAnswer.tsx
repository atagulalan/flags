import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Question } from '@/types'
import Flag from 'react-world-flags'
import { getAllCountries } from '@/data/countries'

interface TypeAnswerProps {
  question: Question
  onSubmit: (answer: string) => void
  feedback: 'correct' | 'incorrect' | null
  onNext?: () => void
  flagSize?: 'small' | 'medium' | 'large'
}

const flagSizeClasses = {
  small: 'max-w-48 h-32',
  medium: 'max-w-80 h-48',
  large: 'max-w-96 h-64'
}

export const TypeAnswer = ({
  question,
  onSubmit,
  feedback,
  flagSize = 'medium'
}: TypeAnswerProps) => {
  const { t } = useTranslation()
  const [answer, setAnswer] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const allCountryNames = useMemo(
    () => getAllCountries().map((c) => t('countries.' + c.code)),
    [t]
  )

  useEffect(() => {
    if (feedback === null) {
      setAnswer('')
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }, [feedback, question.country.code])

  useEffect(() => {
    if (answer.trim() && !feedback) {
      const filtered = allCountryNames
        .filter((name) => name.toLowerCase().startsWith(answer.toLowerCase()))
        .slice(0, 10)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [answer, feedback, allCountryNames])

  const correctAnswer = useMemo(
    () => t('countries.' + question.country.code),
    [t, question.country.code]
  )

  const checkAndSubmit = () => {
    if (feedback !== null || !answer.trim()) return false

    // Check if answer exactly matches (case-insensitive, trimmed)
    const normalizedAnswer = answer.toLowerCase().trim()
    const normalizedCorrect = correctAnswer.toLowerCase().trim()

    if (normalizedAnswer !== normalizedCorrect) {
      // Answer doesn't match exactly, don't submit
      return false
    }

    onSubmit(answer)
    setShowSuggestions(false)
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    checkAndSubmit()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setAnswer(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showSuggestions && suggestions.length > 0 && selectedIndex >= 0) {
        // If a suggestion is selected, use it
        e.preventDefault()
        handleSuggestionClick(suggestions[selectedIndex])
      } else {
        // Otherwise, submit the form if answer matches exactly
        e.preventDefault()
        checkAndSubmit()
      }
      return
    }

    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-2xl font-semibold mb-0">
            {t('game.typeCountryName')}
          </div>
          <div
            className={`w-full ${flagSizeClasses[flagSize]} flex items-center justify-center rounded-lg`}
          >
            <Flag
              code={question.country.code}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            onBlur={() => {
              // Delay to allow click events on suggestions
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            onKeyDown={handleKeyDown}
            placeholder={t('game.enterCountryName')}
            disabled={feedback !== null}
            className="text-lg h-12"
            autoFocus
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-2 text-foreground hover:bg-accent cursor-pointer ${
                    index === selectedIndex ? 'bg-accent' : ''
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={feedback !== null || !answer.trim()}
          className={`w-full h-12 text-lg ${
            feedback === 'correct'
              ? 'bg-green-600 hover:bg-green-600 text-white'
              : ''
          }`}
        >
          {t('game.submitAnswer')}
        </Button>
      </form>
    </div>
  )
}
