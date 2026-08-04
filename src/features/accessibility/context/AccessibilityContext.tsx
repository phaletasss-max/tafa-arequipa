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
        const langCode = (settings.language || 'ES').toUpperCase()
        
        const SPEECH_LANG_MAP: Record<string, string> = {
          ES: 'es-PE',
          EN: 'en-US',
          JA: 'ja-JP',
          PT: 'pt-BR',
          FR: 'fr-FR',
          DE: 'de-DE',
          IT: 'it-IT',
          ZH: 'zh-CN',
          KO: 'ko-KR',
          NL: 'nl-NL',
        }

        const SPEECH_TEXT_MAP: Record<string, string> = {
          ES: 'Bienvenido al Explorador Turístico TAFA Arequipa. Descubre la Plaza de Armas, el Monasterio de Santa Catalina, el Cañón del Colca y el Volcán Misti.',
          EN: 'Welcome to the TAFA Arequipa Official Tourism Explorer. Discover Plaza de Armas, Santa Catalina Monastery, Colca Canyon, and Misti Volcano.',
          JA: 'TAFAアレキパ公式観光エクスプローラーへようこそ。アルマス広場、サンタ・カタリナ修道院、コルカ渓谷、ミスティ火山を探索できます。',
          PT: 'Bem-vindo ao Explorador Turístico Oficial TAFA Arequipa. Descubra a Praça de Armas, o Monastério de Santa Catalina, o Cânion do Colca e o Vulcão Misti.',
          FR: 'Bienvenue sur l\'Explorateur Touristique Officiel TAFA Arequipa. Découvrez la Place d\'Armes, le Monastère de Sainte-Catherine, le Canyon de Colca et le Volcan Misti.',
          DE: 'Willkommen beim offiziellen Tourismus-Explorer TAFA Arequipa. Entdecken Sie die Plaza de Armas, das Kloster Santa Catalina, den Colca-Canyon und den Vulkan Misti.',
          IT: 'Benvenuto nell\'Esploratore Turistico Ufficiale TAFA Arequipa. Scopri la Plaza de Armas, il Monastero di Santa Catalina, il Canyon del Colca e il Vulcano Misti.',
          ZH: '欢迎使用TAFA阿雷基帕官方旅游探索器。探索武器广场、圣卡塔利娜修道院、科尔卡大峡谷和米斯蒂火山。',
          KO: 'TAFA 아레키파 공식 관광 탐색기에 오신 것을 환영합니다. 아르마스 광장, 산타 카탈리나 수녀원, 콜카 계곡, 미스티 화산을 탐험해보세요.',
          NL: 'Welkom bij de officiële toeristische verkenner TAFA Arequipa. Ontdek de Plaza de Armas, het Santa Catalina-klooster, de Colca Canyon en de Misti-vulkaan.',
        }

        const targetLang = SPEECH_LANG_MAP[langCode] || 'es-PE'
        const textToRead = SPEECH_TEXT_MAP[langCode] || SPEECH_TEXT_MAP.ES

        const utterance = new SpeechSynthesisUtterance(textToRead)
        utterance.lang = targetLang

        // Intentar seleccionar voz nativa disponible en el navegador para ese idioma
        const voices = window.speechSynthesis.getVoices()
        const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLang.split('-')[0]))
        if (matchingVoice) {
          utterance.voice = matchingVoice
        }

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
