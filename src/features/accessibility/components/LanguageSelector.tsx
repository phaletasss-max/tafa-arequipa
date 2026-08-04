import { Globe } from 'lucide-react'
import { useAccessibility } from '../hooks/useAccessibility'
import type { LanguageOption } from '../types/accessibility'

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ES', label: 'ES', nativeName: 'Español' },
  { code: 'EN', label: 'EN', nativeName: 'English' },
  { code: 'FR', label: 'FR', nativeName: 'Français' },
  { code: 'DE', label: 'DE', nativeName: 'Deutsch' },
  { code: 'PT', label: 'PT', nativeName: 'Português' },
  { code: 'IT', label: 'IT', nativeName: 'Italiano' },
  { code: 'JA', label: 'JA', nativeName: '日本語' },
  { code: 'ZH', label: 'ZH', nativeName: '中文' },
  { code: 'KO', label: 'KO', nativeName: '한국어' },
  { code: 'NL', label: 'NL', nativeName: 'Nederlands' },
]

export default function LanguageSelector() {
  const { settings, setLanguage } = useAccessibility()

  return (
    <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-slate-200">
      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <select
        value={settings.language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent text-slate-200 font-semibold uppercase text-[11px] border-none outline-none cursor-pointer"
        aria-label="Seleccionar idioma de la plataforma"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
            {lang.code} - {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  )
}
