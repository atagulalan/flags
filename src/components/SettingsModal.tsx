import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Moon,
  Sun,
  Languages,
  Zap,
  Volume2,
  Clock,
  MessageSquare,
  Gamepad2,
  Type,
  Flag,
  RotateCcw,
  Trash2,
  Minus,
  Square,
  Maximize2
} from 'lucide-react'
import i18n from '@/i18n'
import { GameMode } from '@/types'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  enableSoundEffects: boolean
  onToggleSoundEffects: () => void
  enableAnimations: boolean
  onToggleAnimations: () => void
  autoAdvanceDelay: number
  onAutoAdvanceDelayChange: (value: number) => void
  feedbackDuration: number
  onFeedbackDurationChange: (value: number) => void
  enabledModes: GameMode[]
  onEnabledModesChange: (modes: GameMode[]) => void
  fontSize: 'small' | 'medium' | 'large'
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void
  flagSize: 'small' | 'medium' | 'large'
  onFlagSizeChange: (size: 'small' | 'medium' | 'large') => void
  onResetScore: () => void
  onResetProgress: () => void
}

export const SettingsModal = ({
  open,
  onOpenChange,
  isDarkMode,
  onToggleDarkMode,
  enableSoundEffects,
  onToggleSoundEffects,
  enableAnimations,
  onToggleAnimations,
  autoAdvanceDelay,
  onAutoAdvanceDelayChange,
  feedbackDuration,
  onFeedbackDurationChange,
  enabledModes,
  onEnabledModesChange,
  fontSize,
  onFontSizeChange,
  flagSize,
  onFlagSizeChange,
  onResetScore,
  onResetProgress
}: SettingsModalProps) => {
  const { t } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)
  const [showResetScoreConfirm, setShowResetScoreConfirm] = useState(false)
  const [showResetProgressConfirm, setShowResetProgressConfirm] =
    useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('countryFlags_language') || 'en'
    setCurrentLanguage(savedLanguage)
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('countryFlags_language', lng)
    setCurrentLanguage(lng)
  }

  const handleModeToggle = (mode: GameMode) => {
    if (enabledModes.includes(mode)) {
      if (enabledModes.length > 1) {
        onEnabledModesChange(enabledModes.filter((m) => m !== mode))
      }
    } else {
      onEnabledModesChange([...enabledModes, mode])
    }
  }

  const handleResetScore = () => {
    onResetScore()
    setShowResetScoreConfirm(false)
  }

  const handleResetProgress = () => {
    onResetProgress()
    setShowResetProgressConfirm(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-screen max-h-screen m-0 rounded-none p-4 top-0 left-0 translate-x-0 translate-y-0 flex flex-col">
        <DialogHeader className="flex-shrink-0 pt-4">
          <DialogTitle>{t('settings.title')}</DialogTitle>
          <DialogDescription>{t('settings.description')}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-x-hidden flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
            <div className="flex flex-col p-4 border rounded-lg gap-4 md:col-span-2">
              <div className="flex flex-col">
                <Label className="text-sm font-medium cursor-pointer flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  {t('settings.questionModes')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.questionModesDesc')}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="mode-multiple-choice"
                    className="text-sm cursor-pointer"
                  >
                    {t('settings.modeMultipleChoice')}
                  </Label>
                  <Switch
                    id="mode-multiple-choice"
                    checked={enabledModes.includes('multiple-choice')}
                    onCheckedChange={() => handleModeToggle('multiple-choice')}
                    disabled={
                      enabledModes.length === 1 &&
                      enabledModes.includes('multiple-choice')
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="mode-type-answer"
                    className="text-sm cursor-pointer"
                  >
                    {t('settings.modeTypeAnswer')}
                  </Label>
                  <Switch
                    id="mode-type-answer"
                    checked={enabledModes.includes('type-answer')}
                    onCheckedChange={() => handleModeToggle('type-answer')}
                    disabled={
                      enabledModes.length === 1 &&
                      enabledModes.includes('type-answer')
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="mode-select-flag"
                    className="text-sm cursor-pointer"
                  >
                    {t('settings.modeSelectFlag')}
                  </Label>
                  <Switch
                    id="mode-select-flag"
                    checked={enabledModes.includes('select-flag')}
                    onCheckedChange={() => handleModeToggle('select-flag')}
                    disabled={
                      enabledModes.length === 1 &&
                      enabledModes.includes('select-flag')
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg gap-2">
              <div className="flex flex-col flex-1 min-w-0">
                <Label
                  htmlFor="language"
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <Languages className="h-4 w-4" />
                  {t('common.language')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.languageDesc')}
                </p>
              </div>
              <Select
                id="language"
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-auto min-w-[140px] max-w-[180px] flex-shrink-0"
              >
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="ru">Русский</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="th">ไทย</option>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex flex-col">
                <Label
                  htmlFor="dark-mode"
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  {isDarkMode ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  {t('common.darkMode')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.darkModeDesc')}
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={onToggleDarkMode}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg gap-2">
              <div className="flex flex-col flex-1 min-w-0">
                <Label
                  htmlFor="enable-sound-effects"
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  {t('settings.enableSoundEffects')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.enableSoundEffectsDesc')}
                </p>
              </div>
              <Switch
                id="enable-sound-effects"
                checked={enableSoundEffects}
                onCheckedChange={onToggleSoundEffects}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg gap-2">
              <div className="flex flex-col flex-1 min-w-0">
                <Label
                  htmlFor="enable-animations"
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  {t('settings.enableAnimations')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.enableAnimationsDesc')}
                </p>
              </div>
              <Switch
                id="enable-animations"
                checked={enableAnimations}
                onCheckedChange={onToggleAnimations}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg gap-2">
              <div className="flex flex-col flex-1 min-w-0">
                <Label
                  htmlFor="auto-advance-delay"
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  {t('settings.autoAdvanceDelay')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.autoAdvanceDelayDesc')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="auto-advance-delay"
                  type="number"
                  min="0"
                  max="5000"
                  step="100"
                  value={autoAdvanceDelay}
                  onChange={(e) => {
                    let value = e.target.value
                    // Remove leading zeros but keep single 0
                    if (
                      value.length > 1 &&
                      value.startsWith('0') &&
                      value[1] !== '.'
                    ) {
                      value = value.replace(/^0+/, '')
                    }
                    const numValue = parseInt(value) || 0
                    onAutoAdvanceDelayChange(numValue)
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement
                    let value = target.value
                    // Remove leading zeros while typing
                    if (
                      value.length > 1 &&
                      value.startsWith('0') &&
                      value[1] !== '.'
                    ) {
                      value = value.replace(/^0+/, '')
                      target.value = value
                    }
                  }}
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground">ms</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg gap-2">
              <div className="flex flex-col flex-1 min-w-0">
                <Label
                  htmlFor="feedback-duration"
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t('settings.feedbackDuration')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.feedbackDurationDesc')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="feedback-duration"
                  type="number"
                  min="0"
                  max="10000"
                  step="500"
                  value={feedbackDuration}
                  onChange={(e) => {
                    let value = e.target.value
                    // Remove leading zeros but keep single 0
                    if (
                      value.length > 1 &&
                      value.startsWith('0') &&
                      value[1] !== '.'
                    ) {
                      value = value.replace(/^0+/, '')
                    }
                    const numValue = parseInt(value) || 0
                    onFeedbackDurationChange(numValue)
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement
                    let value = target.value
                    // Remove leading zeros while typing
                    if (
                      value.length > 1 &&
                      value.startsWith('0') &&
                      value[1] !== '.'
                    ) {
                      value = value.replace(/^0+/, '')
                      target.value = value
                    }
                  }}
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground">ms</span>
              </div>
            </div>

            <div className="flex flex-col p-4 border rounded-lg gap-4">
              <div className="flex flex-col">
                <Label className="text-sm font-medium cursor-pointer flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  {t('settings.fontSize')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.fontSizeDesc')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={fontSize === 'small' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFontSizeChange('small')}
                  className="flex-1 flex items-center gap-2"
                >
                  <Minus className="h-4 w-4" />
                  {t('settings.sizeSmall')}
                </Button>
                <Button
                  variant={fontSize === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFontSizeChange('medium')}
                  className="flex-1 flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  {t('settings.sizeMedium')}
                </Button>
                <Button
                  variant={fontSize === 'large' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFontSizeChange('large')}
                  className="flex-1 flex items-center gap-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  {t('settings.sizeLarge')}
                </Button>
              </div>
            </div>

            <div className="flex flex-col p-4 border rounded-lg gap-4">
              <div className="flex flex-col">
                <Label className="text-sm font-medium cursor-pointer flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  {t('settings.flagSize')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.flagSizeDesc')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={flagSize === 'small' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFlagSizeChange('small')}
                  className="flex-1 flex items-center gap-2"
                >
                  <Minus className="h-4 w-4" />
                  {t('settings.sizeSmall')}
                </Button>
                <Button
                  variant={flagSize === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFlagSizeChange('medium')}
                  className="flex-1 flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  {t('settings.sizeMedium')}
                </Button>
                <Button
                  variant={flagSize === 'large' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFlagSizeChange('large')}
                  className="flex-1 flex items-center gap-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  {t('settings.sizeLarge')}
                </Button>
              </div>
            </div>

            <div className="flex flex-col p-4 border rounded-lg gap-4 border-destructive/50 md:col-span-2">
              <div className="flex flex-col">
                <Label className="text-sm font-medium text-destructive">
                  {t('settings.dangerZone')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.dangerZoneDesc')}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetScoreConfirm(true)}
                  className="w-full justify-start"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('settings.resetScore')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowResetProgressConfirm(true)}
                  className="w-full justify-start"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('settings.resetProgress')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <Dialog
        open={showResetScoreConfirm}
        onOpenChange={setShowResetScoreConfirm}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.confirmReset')}</DialogTitle>
            <DialogDescription>
              {t('settings.confirmResetScore')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowResetScoreConfirm(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleResetScore}>
              {t('settings.reset')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showResetProgressConfirm}
        onOpenChange={setShowResetProgressConfirm}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.confirmReset')}</DialogTitle>
            <DialogDescription>
              {t('settings.confirmResetProgress')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowResetProgressConfirm(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleResetProgress}>
              {t('settings.reset')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
