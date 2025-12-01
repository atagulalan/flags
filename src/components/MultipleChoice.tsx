import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Question } from '@/types'
import Flag from 'react-world-flags'

interface MultipleChoiceProps {
  question: Question
  onSubmit: (answer: string) => void
  feedback: 'correct' | 'incorrect' | null
  flagSize?: 'small' | 'medium' | 'large'
}

const flagSizeClasses = {
  small: 'max-w-48 h-32',
  medium: 'max-w-80 h-48',
  large: 'max-w-96 h-64'
}

export const MultipleChoice = ({
  question,
  onSubmit,
  feedback,
  flagSize = 'medium'
}: MultipleChoiceProps) => {
  const { t } = useTranslation()
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const handleAnswer = (answer: string) => {
    if (feedback !== null) return // Prevent multiple submissions
    setSelectedAnswer(answer)
    onSubmit(answer)
  }

  useEffect(() => {
    if (feedback === null) {
      setSelectedAnswer(null)
    }
  }, [feedback, question.country.code])

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-2xl font-semibold mb-0">
            {t('game.whichCountry')}
          </div>
          <div
            className={`w-full ${flagSizeClasses[flagSize]} flex items-center justify-center`}
          >
            <Flag
              code={question.country.code}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options?.map((option, index) => {
          const correctName = t('countries.' + question.country.code)
          const isCorrectAnswer = option === correctName
          const isUserSelected = selectedAnswer === option
          const isCorrect = feedback === 'correct' && isCorrectAnswer
          const showCorrect = feedback === 'incorrect' && isCorrectAnswer
          const showWrong =
            feedback === 'incorrect' && isUserSelected && !isCorrectAnswer

          return (
            <Button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
              variant="outline"
              className={`h-auto min-h-16 py-4 text-lg whitespace-normal break-words text-balance ${
                isCorrect || showCorrect
                  ? 'bg-green-600 hover:bg-green-600 border-green-700 text-white'
                  : showWrong
                  ? 'bg-red-600 hover:bg-red-600 border-red-700 text-white'
                  : ''
              }`}
            >
              {option}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
