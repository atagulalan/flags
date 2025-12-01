import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Question } from '@/types'
import Flag from 'react-world-flags'

interface SelectFlagProps {
  question: Question
  onSubmit: (answer: string) => void
  feedback: 'correct' | 'incorrect' | null
  flagSize?: 'small' | 'medium' | 'large'
}

const flagButtonSizeClasses = {
  small: 'h-24',
  medium: 'h-32',
  large: 'h-40'
}

export const SelectFlag = ({
  question,
  onSubmit,
  feedback,
  flagSize = 'medium'
}: SelectFlagProps) => {
  const { t } = useTranslation()
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  // Reconstruct the options from the question
  const options = question.options || []

  const handleAnswer = (code: string) => {
    if (feedback !== null) return // Prevent multiple submissions
    setSelectedAnswer(code)
    onSubmit(code)
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
            {t('game.whichFlag', {
              country: t('countries.' + question.country.code)
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {options.map((code, index) => {
          const isCorrectAnswer = code === question.country.code
          const isUserSelected = selectedAnswer === code
          const isCorrect = feedback === 'correct' && isCorrectAnswer
          const showCorrect = feedback === 'incorrect' && isCorrectAnswer
          const showWrong =
            feedback === 'incorrect' && isUserSelected && !isCorrectAnswer

          return (
            <Button
              key={index}
              onClick={() => handleAnswer(code as string)}
              disabled={feedback !== null}
              variant="outline"
              className={`${flagButtonSizeClasses[flagSize]} p-2 ${
                isCorrect || showCorrect
                  ? 'bg-green-600 hover:bg-green-600 border-green-700'
                  : showWrong
                  ? 'bg-red-600 hover:bg-red-600 border-red-700'
                  : ''
              }`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Flag
                  code={code as string}
                  className="w-full h-full object-contain rounded"
                />
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
