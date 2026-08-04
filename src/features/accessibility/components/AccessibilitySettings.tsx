import { Type, Eye, Volume2 } from 'lucide-react'
import { useAccessibility } from '../hooks/useAccessibility'

export default function AccessibilitySettings() {
  const { settings, toggleHighContrast, cycleFontScale, toggleScreenReader } = useAccessibility()

  const textLabel =
    settings.fontScale === 'normal'
      ? 'Texto: A'
      : settings.fontScale === 'large'
      ? 'Texto: A+'
      : 'Texto: A++'

  return (
    <div className="flex items-center gap-2">
      {/* Font Resizing Button */}
      <button
        onClick={cycleFontScale}
        title="Cambiar tamaño de texto (Normal / Grande / Extra Grande)"
        aria-label="Cambiar tamaño de fuente"
        className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1 text-slate-200 font-semibold transition-colors"
      >
        <Type className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{textLabel}</span>
      </button>

      {/* High Contrast Toggle Button */}
      <button
        onClick={toggleHighContrast}
        title="Activar o desactivar modo Alto Contraste WCAG AAA"
        aria-label="Modo Alto Contraste"
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors border ${
          settings.highContrast
            ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
        }`}
      >
        <Eye className="w-3.5 h-3.5 shrink-0" />
        <span>{settings.highContrast ? 'Contraste Alto' : 'Contraste'}</span>
      </button>

      {/* Audio Voice Speech Synthesizer */}
      <button
        onClick={toggleScreenReader}
        title="Escuchar audio resumen de la página"
        aria-label="Audioruta y lectura por voz"
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors border ${
          settings.screenReaderActive
            ? 'bg-red-600 text-white border-red-500 animate-pulse'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5 shrink-0" />
        <span>{settings.screenReaderActive ? 'Detener Voz' : 'Audioruta'}</span>
      </button>
    </div>
  )
}
