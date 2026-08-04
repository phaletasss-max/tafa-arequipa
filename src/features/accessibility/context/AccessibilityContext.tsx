import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AccessibilitySettings, AccessibilityContextType, FontScale } from '../types/accessibility'
import { useTranslation } from 'react-i18next'
import { setAppLanguage } from '@/lib/i18n'

const STORAGE_KEY = 'tafa_accessibility_settings'

const defaultSettings: AccessibilitySettings = {
  language: 'ES',
  highContrast: false,
  fontScale: 'normal',
  visualMode: false,
  hearingMode: false,
  screenReaderActive: false,
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [announcement, setAnnouncement] = useState<string>('')

  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) }
      }
    } catch (_) {}
    return defaultSettings
  })

  // Synchronize settings to localStorage & apply DOM side effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (_) {}

    const html = document.documentElement
    const body = document.body

    // 1. High contrast mode
    if (settings.highContrast) {
      body.classList.add('wcag-high-contrast')
      html.classList.add('wcag-high-contrast')
    } else {
      body.classList.remove('wcag-high-contrast')
      html.classList.remove('wcag-high-contrast')
    }

    // 2. Font scale (A, A+, A++)
    html.classList.remove('font-scale-large', 'font-scale-extralarge')
    if (settings.fontScale === 'large') {
      html.classList.add('font-scale-large')
    } else if (settings.fontScale === 'extralarge') {
      html.classList.add('font-scale-extralarge')
    }

    // 3. Visual mode
    if (settings.visualMode) {
      html.classList.add('visual-mode-active')
    } else {
      html.classList.remove('visual-mode-active')
    }

    // 4. Web Speech API Speech Synthesis for audio route / screen reader
    if ('speechSynthesis' in window) {
      if (settings.screenReaderActive) {
        const textToRead = 'Bienvenido al Explorador Turístico TAFA Arequipa. Descubre la Plaza de Armas, el Monasterio de Santa Catalina, el Cañón del Colca y el Volcán Misti.'
        const utterance = new SpeechSynthesisUtterance(textToRead)
        utterance.lang = settings.language === 'EN' ? 'en-US' : 'es-PE'
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
      } else {
        window.speechSynthesis.cancel()
      }
    }
  }, [settings])

  const setLanguage = (language: string) => {
    setSettings(prev => ({ ...prev, language }))
    setAppLanguage(language)
    announce(`Idioma cambiado a ${language}`)
  }

  const toggleHighContrast = () => {
    setSettings(prev => {
      const next = !prev.highContrast
      announce(next ? 'Modo Alto Contraste WCAG AAA activado' : 'Modo Alto Contraste desactivado')
      return { ...prev, highContrast: next }
    })
  }

  const cycleFontScale = () => {
    setSettings(prev => {
      const nextMap: Record<FontScale, FontScale> = {
        normal: 'large',
        large: 'extralarge',
        extralarge: 'normal',
      }
      const nextScale = nextMap[prev.fontScale]
      const labels: Record<FontScale, string> = {
        normal: 'tamaño normal (A)',
        large: 'tamaño grande (A+)',
        extralarge: 'tamaño extra grande (A++)',
      }
      announce(`Tamaño de fuente cambiado a ${labels[nextScale]}`)
      return { ...prev, fontScale: nextScale }
    })
  }

  const toggleVisualMode = () => {
    setSettings(prev => {
      const next = !prev.visualMode
      announce(next ? 'Modo Discapacidad Visual activado' : 'Modo Discapacidad Visual desactivado')
      return { ...prev, visualMode: next }
    })
  }

  const toggleHearingMode = () => {
    setSettings(prev => {
      const next = !prev.hearingMode
      announce(next ? 'Modo Lengua de Señas activado' : 'Modo Lengua de Señas desactivado')
      return { ...prev, hearingMode: next }
    })
  }

  const toggleScreenReader = () => {
    setSettings(prev => {
      const next = !prev.screenReaderActive
      announce(next ? 'Lectura por voz iniciada' : 'Lectura por voz detenida')
      return { ...prev, screenReaderActive: next }
    })
  }

  function announce(message: string) {
    setAnnouncement(message)
    setTimeout(() => setAnnouncement(''), 3000)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setLanguage,
        toggleHighContrast,
        cycleFontScale,
        toggleVisualMode,
        toggleHearingMode,
        toggleScreenReader,
      }}
    >
      {/* WCAG 2.2 AA ARIA Live Region for Announcement */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibilityContext(): AccessibilityContextType {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider')
  }
  return context
}
