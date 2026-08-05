import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const supportedLngs = ['es', 'en', 'fr', 'de', 'pt', 'it', 'ja', 'zh', 'ko', 'nl'] as const
const defaultLng = 'es'
// `sections` cubre las secciones de la landing montadas en PT-09, que hasta
// ahora tenían su texto fijo en español dentro de un sitio de 10 idiomas.
const namespaces = ['navigation', 'hero', 'explorer', 'accessibility', 'common', 'forms', 'modals', 'sections'] as const
const localeModules = import.meta.glob('../locales/*/*.json', { eager: false }) as Record<string, () => Promise<{ default: Record<string, unknown> }>>

function normalizeLanguage(lng?: string | null) {
  if (!lng) return defaultLng
  const candidate = lng.toLowerCase().split('-')[0]
  return supportedLngs.includes(candidate as (typeof supportedLngs)[number]) ? candidate : defaultLng
}

async function loadNamespaceResources(language: string, namespace: string) {
  const modulePath = `../locales/${language}/${namespace}.json`
  const loader = localeModules[modulePath]
  if (!loader) {
    // Si no existe el módulo exacto para el idioma (p. ej. de, fr, pt), usar fallback 'es'
    const fallbackPath = `../locales/${defaultLng}/${namespace}.json`
    const fallbackLoader = localeModules[fallbackPath]
    if (!fallbackLoader) return null
    const fallbackModule = await fallbackLoader()
    return (fallbackModule.default ?? fallbackModule) as Record<string, unknown>
  }

  const module = await loader()
  return (module.default ?? module) as Record<string, unknown>
}

export async function loadLanguageResources(language: string) {
  const normalized = normalizeLanguage(language)

  for (const namespace of namespaces) {
    const bundle = await loadNamespaceResources(normalized, namespace)
    if (bundle) {
      i18n.addResourceBundle(normalized, namespace, bundle, true, true)
    }
  }

  return normalized
}

export async function setAppLanguage(languageCode: string) {
  const normalized = normalizeLanguage(languageCode)
  await loadLanguageResources(normalized)
  await i18n.changeLanguage(normalized)
  document.documentElement.lang = normalized
  localStorage.setItem('i18nextLng', normalized)
  return normalized
}

export async function initI18n() {
  if (i18n.isInitialized) return i18n

  await i18n.use(LanguageDetector).use(initReactI18next).init({
    supportedLngs: [...supportedLngs],
    fallbackLng: defaultLng,
    defaultNS: 'common',
    ns: [...namespaces],
    load: 'languageOnly',
    returnEmptyString: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  })

  const detected = normalizeLanguage(i18n.resolvedLanguage || i18n.language || defaultLng)
  await loadLanguageResources(defaultLng) // Carga base en español
  if (detected !== defaultLng) {
    await loadLanguageResources(detected) // Carga idioma detectado
  }

  await i18n.changeLanguage(detected)
  document.documentElement.lang = detected
  return i18n
}

// Suscribirse a eventos de cambio de idioma de i18next para cargar paquetes faltantes dinámicamente
i18n.on('languageChanged', (lng) => {
  const normalized = normalizeLanguage(lng)
  loadLanguageResources(normalized)
  document.documentElement.lang = normalized
})

export default i18n
