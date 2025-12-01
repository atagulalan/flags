import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { getCountriesByLevel } from '@/data/countries'

interface LevelSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectLevel: (level: number) => void
  currentLevel: number
}

export const LevelSelector = ({
  open,
  onOpenChange,
  onSelectLevel,
  currentLevel
}: LevelSelectorProps) => {
  const { t } = useTranslation()
  const levels = [
    {
      number: 1,
      name: t('levelSelector.beginner'),
      description: t('levelSelector.top20')
    },
    {
      number: 2,
      name: t('levelSelector.intermediate'),
      description: t('levelSelector.top50')
    },
    {
      number: 3,
      name: t('levelSelector.advanced'),
      description: t('levelSelector.top100')
    },
    {
      number: 4,
      name: t('levelSelector.expert'),
      description: t('levelSelector.allCountries')
    }
  ]

  const handleSelectLevel = (level: number) => {
    onSelectLevel(level)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-screen max-h-screen m-0 rounded-none p-4 top-0 left-0 translate-x-0 translate-y-0 flex flex-col">
        <DialogHeader className="flex-shrink-0 pt-4">
          <DialogTitle>{t('levelSelector.title')}</DialogTitle>
          <DialogDescription>
            {t('levelSelector.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-x-hidden flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto min-h-0 p-2">
            {levels.map((level) => {
              const countryCount = getCountriesByLevel(level.number).length
              return (
                <Card
                  key={level.number}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    currentLevel === level.number ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectLevel(level.number)}
                >
                  <CardHeader>
                    <CardTitle>
                      {t('game.level')} {level.number}: {level.name}
                    </CardTitle>
                    <CardDescription>{level.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {t('levelSelector.countries', { count: countryCount })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
