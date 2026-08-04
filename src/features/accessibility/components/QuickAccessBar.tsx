import LanguageSelector from './LanguageSelector'
import AccessibilitySettings from './AccessibilitySettings'
import VisualModeToggle from './VisualModeToggle'
import SignLanguageButton from './SignLanguageButton'
import AIAccessButton from './AIAccessButton'
import UserMenu from './UserMenu'

interface QuickAccessBarProps {
  onOpenAuth?: () => void
  onOpenPass?: () => void
  onOpenAI?: () => void
  onOpenSignLanguage?: () => void
  touristUser?: { nombre: string; docType: string; docNum: string } | null
}

export default function QuickAccessBar({
  onOpenAuth,
  onOpenPass,
  onOpenAI,
  onOpenSignLanguage,
  touristUser,
}: QuickAccessBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-200 text-xs py-2.5 px-4 md:px-8 shadow-md">
      {/* Screen Reader Accessible Prompt (WCAG 2.2 AA) */}
      <div className="sr-only focus:not-sr-only focus:p-2 focus:bg-amber-400 focus:text-black font-bold">
        ¿Utilizas un lector de pantalla? Activa el modo de navegación asistida.
      </div>

      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        
        {/* Left Panel: Modular Accessibility & Language Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <LanguageSelector />
          <AccessibilitySettings />
          <VisualModeToggle />
          <SignLanguageButton onOpenSignLanguage={onOpenSignLanguage} />
        </div>

        {/* Right Panel: AI & User Account Menu */}
        <div className="flex items-center gap-2.5">
          <AIAccessButton onOpenAI={onOpenAI} />
          <UserMenu
            touristUser={touristUser}
            onOpenAuth={onOpenAuth}
            onOpenPass={onOpenPass}
          />
        </div>

      </div>
    </header>
  )
}
