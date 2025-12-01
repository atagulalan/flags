import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Trophy,
  Flame,
  Target,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Settings,
  Layers
} from 'lucide-react'
import { GameState } from '@/types'
import { getCountriesByLevel } from '@/data/countries'
import { Button } from '@/components/ui/button'

interface GameStatsProps {
  gameState: GameState
  onShowLevelSelector: () => void
  onShowConfidenceModal: () => void
  onShowSettingsModal: () => void
}

export const GameStats = ({
  gameState,
  onShowLevelSelector,
  onShowConfidenceModal,
  onShowSettingsModal
}: GameStatsProps) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const totalCountriesInLevel = getCountriesByLevel(
    gameState.currentLevel
  ).length
  const progress =
    gameState.questionsAnswered > 0
      ? Math.min(
          (gameState.questionsAnswered / (totalCountriesInLevel * 2)) * 100,
          100
        )
      : 0

  return (
    <Card className="w-full">
      {!isExpanded && (
        <CardHeader
          className="py-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{gameState.score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-semibold">{gameState.streak}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">
                  {t('game.level')} {gameState.currentLevel}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      )}

      {isExpanded && (
        <CardContent className="pt-6 pt-3">
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-4 -mt-5">
            <div className="flex flex-col items-center text-center space-y-1">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div className="text-xs md:text-sm text-muted-foreground">
                {t('game.score')}
              </div>
              <div className="text-xl md:text-2xl font-bold">
                {gameState.score}
              </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-1">
              <Flame className="h-5 w-5 text-orange-500" />
              <div className="text-xs md:text-sm text-muted-foreground">
                {t('game.streak')}
              </div>
              <div className="text-xl md:text-2xl font-bold">
                {gameState.streak}
              </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-1">
              <Target className="h-5 w-5 text-blue-500" />
              <div className="text-xs md:text-sm text-muted-foreground">
                {t('game.level')}
              </div>
              <div className="text-xl md:text-2xl font-bold">
                {gameState.currentLevel}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{t('game.progress')}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={onShowLevelSelector}
              className="flex-1 flex-shrink-0"
            >
              <Layers className="h-4 w-4 mr-2" />
              {t('game.changeLevel')}
            </Button>
            <Button
              variant="outline"
              onClick={onShowConfidenceModal}
              className="flex-1 flex-shrink-0"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('game.viewConfidence')}
            </Button>
            <Button
              variant="outline"
              onClick={onShowSettingsModal}
              className="flex-1 flex-shrink-0"
            >
              <Settings className="h-4 w-4 mr-2" />
              {t('common.settings')}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
