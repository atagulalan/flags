import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import Flag from 'react-world-flags'
import { Country } from '@/types'

interface ConfidenceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  getFlagsByConfidence: (ascending: boolean) => Array<{
    country: Country
    confidence: number
    data: { correct: number; total: number }
  }>
}

export const ConfidenceModal = ({
  open,
  onOpenChange,
  getFlagsByConfidence
}: ConfidenceModalProps) => {
  const { t } = useTranslation()
  const [ascending, setAscending] = useState(true)
  const flags = getFlagsByConfidence(ascending)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-screen max-h-screen m-0 rounded-none p-4 top-0 left-0 translate-x-0 translate-y-0 flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
        <DialogHeader className="flex-shrink-0 pt-4">
          <DialogTitle>{t('confidence.title')}</DialogTitle>
          <DialogDescription>{t('confidence.description')}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-x-hidden flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-semibold ${
                ascending ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {ascending
                ? t('confidence.leastConfident')
                : t('confidence.mostConfident')}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAscending(!ascending)}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              {ascending
                ? t('confidence.showMostConfident')
                : t('confidence.showLeastConfident')}
            </Button>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
            {flags.map(({ country, confidence, data }) => (
              <Card key={country.code} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 flex-shrink-0 border rounded">
                    <Flag
                      code={country.code}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 max-w-full">
                    <div className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                      {t('countries.' + country.code)}
                    </div>
                    <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                      {data.total > 0
                        ? t('confidence.correct', {
                            correct: data.correct,
                            total: data.total
                          })
                        : t('confidence.notPracticed')}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="font-semibold whitespace-nowrap">
                      {confidence.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
