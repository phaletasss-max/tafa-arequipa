import LanguageSelector from './LanguageSelector'
import AccessibilitySettings from './AccessibilitySettings'
import VisualModeToggle from './VisualModeToggle'
import SignLanguageButton from './SignLanguageButton'
import AIAccessButton from './AIAccessButton'
import UserMenu from './UserMenu'
import { useTranslation } from 'react-i18next'

interface QuickAccessBarProps {
  onOpenAuth?: () => void
  onOpenSettings?: () => void
  onOpenAI?: () => void
  onOpenSignLanguage?: () => void
}

export default function QuickAccessBar({
  onOpenAuth,
  onOpenSettings,
  onOpenAI,
  onOpenSignLanguage,
}: QuickAccessBarProps) {
  const { t } = useTranslation('accessibility')

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-200 text-xs py-2.5 px-4 md:px-8 shadow-md">
      {/* Skip Link for Keyboard Navigation (WCAG 2.4.1) */}
      <a
        href="#explorar"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-50 focus:p-2.5 focus:bg-tafa-volcán focus:text-white focus:font-bold focus:rounded-lg focus:shadow-2xl focus:outline-none"
      >
        {t('skip_to_content') || 'Saltar al contenido principal'}
      </a>

      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        
        {/* Left Container: Independent Accessibility & Language Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <LanguageSelector />
          <AccessibilitySettings />
          <VisualModeToggle />
          <SignLanguageButton onOpenSignLanguage={onOpenSignLanguage} />
        </div>

        {/* Right Container: AI & User Account Controls */}
        <div className="flex items-center gap-2.5">
          <AIAccessButton onOpenAI={onOpenAI} />
          <UserMenu
            onOpenAuth={onOpenAuth}
            onOpenSettings={onOpenSettings}
          />
        </div>

      </div>
    </header>
  )
}
