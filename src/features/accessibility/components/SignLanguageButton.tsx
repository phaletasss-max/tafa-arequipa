import { Hand } from 'lucide-react'
import { useAccessibility } from '../hooks/useAccessibility'

interface SignLanguageButtonProps {
  onOpenSignLanguage?: () => void
}

export default function SignLanguageButton({ onOpenSignLanguage }: SignLanguageButtonProps) {
  const { settings, toggleHearingMode } = useAccessibility()

  function handleClick() {
    toggleHearingMode()
    if (onOpenSignLanguage) onOpenSignLanguage()
  }

  return (
    <button
      onClick={handleClick}
      title="Modo Discapacidad Auditiva y Lengua de Señas"
      aria-label="Modo Lengua de Señas"
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors border ${
        settings.hearingMode
          ? 'bg-blue-600 text-white border-blue-500 font-bold'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
      }`}
    >
      <Hand className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span>Lengua de Señas</span>
    </button>
  )
}
