import { useState } from 'react'
import { Globe, Accessibility, Eye, Volume2, Bot, User, Type, Hand, ShieldCheck, Sparkles } from 'lucide-react'
import type { TextSizeLevel } from '@/types/accessibility'

interface QuickAccessBarProps {
  currentLanguage?: string
  onLanguageChange?: (lang: string) => void
  onOpenAuth?: () => void
  onOpenPass?: () => void
  onOpenAI?: () => void
  onOpenSignLanguage?: () => void
  touristUser?: { nombre: string; docType: string; docNum: string } | null
}

export default function QuickAccessBar({
  currentLanguage = 'ES',
  onLanguageChange,
  onOpenAuth,
  onOpenPass,
  onOpenAI,
  onOpenSignLanguage,
  touristUser,
}: QuickAccessBarProps) {
  const [highContrast, setHighContrast] = useState(false)
  const [textSize, setTextSize] = useState<TextSizeLevel>('normal')
  const [visualMode, setVisualMode] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  // Toggle High Contrast Mode
  function toggleContrast() {
    const next = !highContrast
    setHighContrast(next)
    if (next) {
      document.body.classList.add('wcag-high-contrast')
    } else {
      document.body.classList.remove('wcag-high-contrast')
    }
  }

  // Cycle Text Size (Normal -> Large -> Extra Large)
  function cycleTextSize() {
    const nextMap: Record<TextSizeLevel, TextSizeLevel> = {
      normal: 'large',
      large: 'extralarge',
      extralarge: 'normal',
    }
    const next = nextMap[textSize]
    setTextSize(next)
    const scaleMap: Record<TextSizeLevel, string> = {
      normal: '100%',
      large: '115%',
      extralarge: '130%',
    }
    document.documentElement.style.fontSize = scaleMap[next]
  }

  // Toggle Visual Impairment Screen-Reader Assistance Mode
  function toggleVisualMode() {
    const next = !visualMode
    setVisualMode(next)
    if (next) {
      document.body.classList.add('wcag-visual-mode')
    } else {
      document.body.classList.remove('wcag-visual-mode')
    }
  }

  // Speech Synthesis Audio Reader
  function readScreenSummary() {
    if (!('speechSynthesis' in window)) {
      alert('Navegador sin soporte de lectura por voz.')
      return
    }

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const text = "Portal Institucional TAFA Arequipa. Plataforma oficial de turismo inteligente e inclusivo. Monasterio de Santa Catalina, Plaza de Armas, Catedral y Cañón del Colca."
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-PE'
    utterance.onend = () => setSpeaking(false)

    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-200 text-xs py-2 px-4 md:px-8 shadow-md">
      {/* Screen Reader Prompt for Accessibility Compliance (WCAG 2.2 AA) */}
      <div className="sr-only focus:not-sr-only focus:p-2 focus:bg-amber-400 focus:text-black font-bold">
        ¿Utilizas un lector de pantalla? Activa el modo de navegación asistida.
      </div>

      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        
        {/* Left Section: Language & Accessibility Configuration Panel */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold uppercase text-[11px] border-none outline-none cursor-pointer"
              aria-label="Seleccionar idioma de la plataforma"
            >
              <option value="ES" className="bg-slate-900 text-white">ES - Español</option>
              <option value="EN" className="bg-slate-900 text-white">EN - English</option>
              <option value="FR" className="bg-slate-900 text-white">FR - Français</option>
              <option value="DE" className="bg-slate-900 text-white">DE - Deutsch</option>
              <option value="PT" className="bg-slate-900 text-white">PT - Português</option>
              <option value="IT" className="bg-slate-900 text-white">IT - Italiano</option>
              <option value="JA" className="bg-slate-900 text-white">JA - 日本語</option>
              <option value="ZH" className="bg-slate-900 text-white">ZH - 中文</option>
              <option value="KO" className="bg-slate-900 text-white">KO - 한국어</option>
              <option value="NL" className="bg-slate-900 text-white">NL - Nederlands</option>
            </select>
          </div>

          {/* Text Size Control */}
          <button
            onClick={cycleTextSize}
            title="Cambiar tamaño de texto (Normal / Grande / Extra Grande)"
            aria-label="Cambiar tamaño de fuente"
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1 text-slate-200 font-semibold transition-colors"
          >
            <Type className="w-3.5 h-3.5 text-slate-400" />
            <span>{textSize === 'normal' ? 'Texto: A' : textSize === 'large' ? 'Texto: A+' : 'Texto: A++'}</span>
          </button>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={toggleContrast}
            title="Activar o desactivar modo Alto Contraste WCAG AAA"
            aria-label="Modo Alto Contraste"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors border ${
              highContrast
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{highContrast ? 'Contraste Alto' : 'Contraste'}</span>
          </button>

          {/* Screen Reader Voice Reader */}
          <button
            onClick={readScreenSummary}
            title="Escuchar resumen por voz"
            aria-label="Audioruta y lectura por voz"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors border ${
              speaking
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{speaking ? 'Detener Voz' : 'Audioruta'}</span>
          </button>

          {/* Visual Impairment Assistance Mode */}
          <button
            onClick={toggleVisualMode}
            title="Modo Discapacidad Visual y Lectores de Pantalla"
            aria-label="Activar modo discapacidad visual"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors border ${
              visualMode
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>Modo Visual</span>
          </button>

          {/* Sign Language Panel Toggle */}
          <button
            onClick={() => onOpenSignLanguage && onOpenSignLanguage()}
            title="Modo Discapacidad Auditiva y Lengua de Señas"
            aria-label="Modo Lengua de Señas"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1 text-slate-200 font-semibold transition-colors"
          >
            <Hand className="w-3.5 h-3.5 text-slate-400" />
            <span>Lengua de Señas</span>
          </button>
        </div>

        {/* Right Section: AI Assistant & Tourist User Account */}
        <div className="flex items-center gap-3">
          {/* AI Assistant Shortcut */}
          <button
            onClick={() => onOpenAI && onOpenAI()}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-1 rounded-full text-xs transition-colors shadow-sm"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>TAFA AI</span>
          </button>

          {/* Tourist Account / Pass */}
          {touristUser ? (
            <button
              onClick={() => onOpenPass && onOpenPass()}
              className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded-full px-3.5 py-1 font-semibold hover:bg-emerald-900/80 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{touristUser.nombre} ({touristUser.docType})</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth && onOpenAuth()}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3.5 py-1 font-semibold text-slate-200 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Cuenta Turista</span>
            </button>
          )}
        </div>

      </div>
    </header>
  )
}
