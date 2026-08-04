import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AccessibilitySettings, AccessibilityContextType, FontScale } from '../types/accessibility'

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
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  // Apply high contrast CSS class to DOM body
  useEffect(() => {
    if (settings.highContrast) {
      document.body.classList.add('wcag-high-contrast')
    } else {
      document.body.classList.remove('wcag-high-contrast')
    }
  }, [settings.highContrast])

  // Apply visual impairment mode CSS class to DOM body
  useEffect(() => {
    if (settings.visualMode) {
      document.body.classList.add('wcag-visual-mode')
    } else {
      document.body.classList.remove('wcag-visual-mode')
    }
  }, [settings.visualMode])

  // Apply font scale to document element
  useEffect(() => {
    const fontScaleMap: Record<FontScale, string> = {
      normal: '100%',
      large: '115%',
      extralarge: '130%',
    }
    document.documentElement.style.fontSize = fontScaleMap[settings.fontScale]
  }, [settings.fontScale])

  const setLanguage = (language: string) => {
    setSettings(prev => ({ ...prev, language }))
  }

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }))
  }

  const cycleFontScale = () => {
    setSettings(prev => {
      const nextMap: Record<FontScale, FontScale> = {
        normal: 'large',
        large: 'extralarge',
        extralarge: 'normal',
      }
      return { ...prev, fontScale: nextMap[prev.fontScale] }
    })
  }

  const toggleVisualMode = () => {
    setSettings(prev => ({ ...prev, visualMode: !prev.visualMode }))
  }

  const toggleHearingMode = () => {
    setSettings(prev => ({ ...prev, hearingMode: !prev.hearingMode }))
  }

  const toggleScreenReader = () => {
    setSettings(prev => ({ ...prev, screenReaderActive: !prev.screenReaderActive }))
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
