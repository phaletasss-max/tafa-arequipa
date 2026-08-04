import { createContext, useContext, useState, ReactNode } from 'react'
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
