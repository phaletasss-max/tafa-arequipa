import { Type, Eye, Volume2 } from 'lucide-react'
import { useAccessibility } from '../hooks/useAccessibility'
import { useTranslation } from 'react-i18next'

export default function AccessibilitySettings() {
  const { settings, toggleHighContrast, cycleFontScale, toggleScreenReader } = useAccessibility()
  const { t } = useTranslation('accessibility')

  const textLabel =
    settings.fontScale === 'normal'
      ? t('font_size_normal')
      : settings.fontScale === 'large'
      ? t('font_size_large')
      : t('font_size_extralarge')

  return (
    <div className="flex items-center gap-2">
      {/* Font Resizing Button */}
      <button
        onClick={cycleFontScale}
        aria-label={`Cambiar tamaño de fuente (actualmente ${textLabel})`}
        title="Cambiar tamaño de texto (Normal / Grande / Extra Grande)"
        className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1 text-slate-200 font-semibold transition-colors focus:outline-none"
      >
        <Type className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
        <span>{textLabel}</span>
      </button>

      {/* High Contrast Toggle Button */}
      <button
        onClick={toggleHighContrast}
        aria-pressed={settings.highContrast}
        aria-label={`Modo Alto Contraste WCAG AAA (${settings.highContrast ? 'activado' : 'desactivado'})`}
        title="Activar o desactivar modo Alto Contraste WCAG AAA"
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors border focus:outline-none ${
          settings.highContrast
            ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
        }`}
      >
        <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{settings.highContrast ? t('contrast_high') : t('contrast_normal')}</span>
      </button>

      {/* Audio Voice Speech Synthesizer */}
      <button
        onClick={toggleScreenReader}
        aria-pressed={settings.screenReaderActive}
        aria-label={`Audioruta y lectura por voz (${settings.screenReaderActive ? 'activado' : 'desactivado'})`}
        title="Escuchar audio resumen de la página"
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors border focus:outline-none ${
          settings.screenReaderActive
            ? 'bg-red-600 text-white border-red-500 animate-pulse'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{settings.screenReaderActive ? t('audio_route_stop') : t('audio_route_start')}</span>
      </button>
    </div>
  )
}
