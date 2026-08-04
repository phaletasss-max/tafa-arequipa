export type FontScale = 'normal' | 'large' | 'extralarge'

export interface LanguageOption {
  code: string
  label: string
  nativeName: string
}

export interface AccessibilitySettings {
  language: string
  highContrast: boolean
  fontScale: FontScale
  visualMode: boolean
  hearingMode: boolean
  screenReaderActive: boolean
}

export interface AccessibilityContextType {
  settings: AccessibilitySettings
  setLanguage: (lang: string) => void
  toggleHighContrast: () => void
  cycleFontScale: () => void
  toggleVisualMode: () => void
  toggleHearingMode: () => void
  toggleScreenReader: () => void
}
