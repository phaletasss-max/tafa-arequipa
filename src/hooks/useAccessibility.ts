import { useState, useEffect } from 'react'
import type { AccessibilitySettings, TextSizeLevel, AccessibilityFilterType } from '@/types/accessibility'

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    textSize: 'normal',
    visualMode: false,
    signLanguageMode: false,
    activeFilter: null,
  })

  // Apply High Contrast class to DOM
  useEffect(() => {
    if (settings.highContrast) {
      document.body.classList.add('wcag-high-contrast')
    } else {
      document.body.classList.remove('wcag-high-contrast')
    }
  }, [settings.highContrast])

  // Apply Visual Assistance Mode class to DOM
  useEffect(() => {
    if (settings.visualMode) {
      document.body.classList.add('wcag-visual-mode')
    } else {
      document.body.classList.remove('wcag-visual-mode')
    }
  }, [settings.visualMode])

  // Apply Font Size scaling to root HTML document
  useEffect(() => {
    const scales: Record<TextSizeLevel, string> = {
      normal: '100%',
      large: '115%',
      extralarge: '130%',
    }
    document.documentElement.style.fontSize = scales[settings.textSize]
  }, [settings.textSize])

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }))
  }

  const cycleTextSize = () => {
    setSettings(prev => {
      const nextMap: Record<TextSizeLevel, TextSizeLevel> = {
        normal: 'large',
        large: 'extralarge',
        extralarge: 'normal',
      }
      return { ...prev, textSize: nextMap[prev.textSize] }
    })
  }

  const toggleVisualMode = () => {
    setSettings(prev => ({ ...prev, visualMode: !prev.visualMode }))
  }

  const toggleSignLanguageMode = () => {
    setSettings(prev => ({ ...prev, signLanguageMode: !prev.signLanguageMode }))
  }

  const setFilter = (filter: AccessibilityFilterType) => {
    setSettings(prev => ({ ...prev, activeFilter: filter }))
  }

  return {
    settings,
    toggleHighContrast,
    cycleTextSize,
    toggleVisualMode,
    toggleSignLanguageMode,
    setFilter,
  }
}
