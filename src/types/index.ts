export interface Country {
  code: string
  level: number
}

export type GameMode = 'multiple-choice' | 'type-answer' | 'select-flag'

export interface Question {
  country: Country
  mode: GameMode
  options?: string[] // For multiple choice and select flag modes
}

export interface GameState {
  currentLevel: number
  score: number
  streak: number
  questionsAnswered: number
  currentQuestion: Question | null
  feedback: 'correct' | 'incorrect' | null
  answerHistory: Array<{
    country: Country
    correct: boolean
    mode: GameMode
  }>
}
