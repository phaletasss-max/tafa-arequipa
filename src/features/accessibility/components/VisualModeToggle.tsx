import { Accessibility } from 'lucide-react'
import { useAccessibility } from '../hooks/useAccessibility'
import { useTranslation } from 'react-i18next'

export default function VisualModeToggle() {
  const { settings, toggleVisualMode } = useAccessibility()
  const { t } = useTranslation('accessibility')

  return (
    <button
      onClick={toggleVisualMode}
      title="Activar modo Discapacidad Visual y Lectores de Pantalla"
      aria-label="Modo Discapacidad Visual"
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors border ${
        settings.visualMode
          ? 'bg-purple-600 text-white border-purple-500 font-bold'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
      }`}
    >
      <Accessibility className="w-3.5 h-3.5 shrink-0" />
      <span>{t('visual_mode')}</span>
    </button>
  )
}
