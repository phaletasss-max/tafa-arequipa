import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const supportedLngs = ['es', 'en', 'fr', 'de', 'pt', 'it', 'ja', 'zh', 'ko', 'nl'] as const
const defaultLng = 'es'
const namespaces = ['navigation', 'hero', 'explorer', 'accessibility', 'common', 'forms', 'modals'] as const
const localeModules = import.meta.glob('../locales/*/*.json', { eager: false }) as Record<string, () => Promise<{ default: Record<string, unknown> }>>

function normalizeLanguage(lng?: string | null) {
  const candidate = (lng || defaultLng).toLowerCase().split('-')[0]
  return supportedLngs.includes(candidate as (typeof supportedLngs)[number]) ? candidate : defaultLng
}

async function loadNamespaceResources(language: string, namespace: string) {
  const modulePath = `../locales/${language}/${namespace}.json`
  const loader = localeModules[modulePath]
  if (!loader) return null

  const module = await loader()
  return (module.default ?? module) as Record<string, unknown>
}

async function loadLanguageResources(language: string) {
  const normalized = normalizeLanguage(language)

  for (const namespace of namespaces) {
    const bundle = await loadNamespaceResources(normalized, namespace)
    if (bundle) {
      i18n.addResourceBundle(normalized, namespace, bundle, true, true)
    }
  }

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
  await loadLanguageResources(detected)

  if (detected !== defaultLng) {
    await loadLanguageResources(defaultLng)
  }

  await i18n.changeLanguage(detected)
  return i18n
}

export default i18n
