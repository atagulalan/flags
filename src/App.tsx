import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from './hooks/useGame'
import { GameStats } from './components/GameStats'
import { FlagQuestion } from './components/FlagQuestion'
import { LevelSelector } from './components/LevelSelector'
import { ConfidenceModal } from './components/ConfidenceModal'
import { SettingsModal } from './components/SettingsModal'
import { Button } from './components/ui/button'
import { Alert, AlertDescription } from './components/ui/alert'
import { XCircle } from 'lucide-react'
import Flag from 'react-world-flags'

const STORAGE_KEYS = {
  SELECTED_LEVEL: 'countryFlags_selectedLevel',
  DISABLE_TYPE_ANSWER: 'countryFlags_disableTypeAnswer',
  GAME_STATE: 'countryFlags_gameState',
  DARK_MODE: 'countryFlags_darkMode',
  LANGUAGE: 'countryFlags_language',
  ENABLE_ANIMATIONS: 'countryFlags_enableAnimations',
  ENABLE_SOUND_EFFECTS: 'countryFlags_enableSoundEffects',
  AUTO_ADVANCE_DELAY: 'countryFlags_autoAdvanceDelay',
  FEEDBACK_DURATION: 'countryFlags_feedbackDuration',
  ENABLED_MODES: 'countryFlags_enabledModes',
  FONT_SIZE: 'countryFlags_fontSize',
  FLAG_SIZE: 'countryFlags_flagSize'
}

function App() {
  const { t } = useTranslation()
  const [showLevelSelector, setShowLevelSelector] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_LEVEL)
    return saved ? parseInt(saved, 10) : 1
  })
  const [showConfidenceModal, setShowConfidenceModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE)
    return saved === 'true'
  })
  const [enableAnimations, setEnableAnimations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENABLE_ANIMATIONS)
    return saved !== 'false' // default true
  })
  const [enableSoundEffects, setEnableSoundEffects] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENABLE_SOUND_EFFECTS)
    return saved !== 'false' // default true
  })
  const [autoAdvanceDelay, setAutoAdvanceDelay] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTO_ADVANCE_DELAY)
    return saved ? parseInt(saved, 10) : 1500
  })
  const [feedbackDuration, setFeedbackDuration] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK_DURATION)
    return saved ? parseInt(saved, 10) : 0
  })
  const [enabledModes, setEnabledModes] = useState<
    Array<'multiple-choice' | 'type-answer' | 'select-flag'>
  >(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENABLED_MODES)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return ['multiple-choice', 'type-answer', 'select-flag']
      }
    }
    return ['multiple-choice', 'type-answer', 'select-flag']
  })
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FONT_SIZE)
    return (saved as 'small' | 'medium' | 'large') || 'medium'
  })
  const [flagSize, setFlagSize] = useState<'small' | 'medium' | 'large'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FLAG_SIZE)
    return (saved as 'small' | 'medium' | 'large') || 'medium'
  })
  const getCountryName = useCallback(
    (code: string) => {
      return t('countries.' + code)
    },
    [t]
  )

  const {
    gameState,
    submitAnswer,
    changeLevel,
    nextQuestion,
    getFlagsByConfidence,
    resetGameState
  } = useGame(
    selectedLevel,
    autoAdvanceDelay,
    enabledModes,
    enableSoundEffects,
    getCountryName
  )

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LEVEL, selectedLevel.toString())
  }, [selectedLevel])

  // Save game progress to localStorage
  useEffect(() => {
    const progressData = {
      score: gameState.score,
      streak: gameState.streak,
      questionsAnswered: gameState.questionsAnswered,
      currentLevel: gameState.currentLevel,
      answerHistory: gameState.answerHistory
    }
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(progressData))
  }, [
    gameState.score,
    gameState.streak,
    gameState.questionsAnswered,
    gameState.currentLevel,
    gameState.answerHistory
  ])

  // Apply dark mode to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode.toString())
  }, [isDarkMode])

  // Update page title
  useEffect(() => {
    document.title = t('common.appTitle')
  }, [t])

  // Apply animations setting on mount and when it changes
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ENABLE_ANIMATIONS,
      enableAnimations.toString()
    )
    if (enableAnimations) {
      document.documentElement.classList.remove('no-animations')
    } else {
      document.documentElement.classList.add('no-animations')
    }
  }, [enableAnimations])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ENABLE_SOUND_EFFECTS,
      enableSoundEffects.toString()
    )
  }, [enableSoundEffects])

  // Apply animations setting on initial load
  useEffect(() => {
    if (!enableAnimations) {
      document.documentElement.classList.add('no-animations')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.AUTO_ADVANCE_DELAY,
      autoAdvanceDelay.toString()
    )
  }, [autoAdvanceDelay])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.FEEDBACK_DURATION,
      feedbackDuration.toString()
    )
  }, [feedbackDuration])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ENABLED_MODES,
      JSON.stringify(enabledModes)
    )
  }, [enabledModes])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize)
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FLAG_SIZE, flagSize)
  }, [flagSize])

  // Auto-hide feedback after duration
  useEffect(() => {
    if (gameState.feedback === 'incorrect' && feedbackDuration > 0) {
      const timer = setTimeout(() => {
        nextQuestion()
      }, feedbackDuration)
      return () => clearTimeout(timer)
    }
  }, [gameState.feedback, feedbackDuration, nextQuestion])

  const resetScore = () => {
    resetGameState({ resetScore: true, resetProgress: false })
  }

  const resetProgress = () => {
    resetGameState({ resetScore: true, resetProgress: true })
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level)
    changeLevel(level)
  }

  const handleAnswer = (answer: string) => {
    submitAnswer(answer)
  }

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  const flagSizeClasses = {
    small: { container: 'max-w-48 h-32', alert: 'w-6 h-4' },
    medium: { container: 'max-w-80 h-48', alert: 'w-8 h-6' },
    large: { container: 'max-w-96 h-64', alert: 'w-10 h-8' }
  }

  return (
    <div
      className={`min-h-screen bg-background p-4 md:p-8 ${fontSizeClasses[fontSize]}`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <GameStats
          gameState={gameState}
          onShowLevelSelector={() => setShowLevelSelector(true)}
          onShowConfidenceModal={() => setShowConfidenceModal(true)}
          onShowSettingsModal={() => setShowSettingsModal(true)}
        />

        <ConfidenceModal
          open={showConfidenceModal}
          onOpenChange={setShowConfidenceModal}
          getFlagsByConfidence={getFlagsByConfidence}
        />

        <LevelSelector
          open={showLevelSelector}
          onOpenChange={setShowLevelSelector}
          onSelectLevel={handleLevelSelect}
          currentLevel={gameState.currentLevel}
        />

        <SettingsModal
          open={showSettingsModal}
          onOpenChange={setShowSettingsModal}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          enableSoundEffects={enableSoundEffects}
          onToggleSoundEffects={() =>
            setEnableSoundEffects(!enableSoundEffects)
          }
          enableAnimations={enableAnimations}
          onToggleAnimations={() => setEnableAnimations(!enableAnimations)}
          autoAdvanceDelay={autoAdvanceDelay}
          onAutoAdvanceDelayChange={setAutoAdvanceDelay}
          feedbackDuration={feedbackDuration}
          onFeedbackDurationChange={setFeedbackDuration}
          enabledModes={enabledModes}
          onEnabledModesChange={setEnabledModes}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          flagSize={flagSize}
          onFlagSizeChange={setFlagSize}
          onResetScore={resetScore}
          onResetProgress={resetProgress}
        />

        {gameState.feedback === 'incorrect' && gameState.currentQuestion && (
          <Alert variant="destructive">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 flex-1">
                <XCircle className="h-4 w-4" />
                <div
                  className={`${flagSizeClasses[flagSize].alert} flex-shrink-0 border rounded`}
                >
                  <Flag
                    code={gameState.currentQuestion.country.code}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <AlertDescription className="font-semibold">
                    {t('game.incorrect')}
                  </AlertDescription>
                  <AlertDescription className="text-sm mt-1">
                    {t('game.correctAnswer', {
                      answer: t(
                        'countries.' + gameState.currentQuestion.country.code
                      )
                    })}
                  </AlertDescription>
                </div>
              </div>
              <Button onClick={nextQuestion} size="sm" className="ml-4">
                {t('common.next')}
              </Button>
            </div>
          </Alert>
        )}

        {gameState.currentQuestion && (
          <FlagQuestion
            question={gameState.currentQuestion}
            onSubmit={handleAnswer}
            feedback={gameState.feedback}
            onNext={nextQuestion}
            flagSize={flagSize}
          />
        )}
      </div>
    </div>
  )
}

export default App
