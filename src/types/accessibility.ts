export type TextSizeLevel = 'normal' | 'large' | 'extralarge'
export type AccessibilityFilterType = 'motriz' | 'auditiva' | 'visual' | null

export interface AccessibilitySettings {
  highContrast: boolean
  textSize: TextSizeLevel
  visualMode: boolean
  signLanguageMode: boolean
  activeFilter: AccessibilityFilterType
}
