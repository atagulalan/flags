import { useTranslation } from 'react-i18next'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { getCountriesByLevel } from '@/data/countries'

interface LevelProgressProps {
  level: number
  questionsAnswered: number
}

export const LevelProgress = ({
  level,
  questionsAnswered
}: LevelProgressProps) => {
  const { t } = useTranslation()
  const totalCountries = getCountriesByLevel(level).length
  const progress = Math.min(
    (questionsAnswered / (totalCountries * 2)) * 100,
    100
  )

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('game.levelProgress', { level })}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardContent>
    </Card>
  )
}
