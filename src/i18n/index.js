import { computed, ref } from 'vue'
import en from './en'
import es from './es'
import ca from './ca'

export const LOCALES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'ca', label: 'CA', name: 'Català' },
]

const messages = { en, es, ca }
const STORAGE_KEY = 'portfolio-locale'
const FALLBACK = 'en'

const isSupported = (code) => LOCALES.some((entry) => entry.code === code)

/**
 * Top-level domain decides the default language:
 *   jordiop.cat -> Catalan
 *   jordiop.es  -> Spanish
 *   jordiop.com -> English
 * Returns null for anything else (localhost, previews, *.vercel.app).
 */
export function localeFromHost(hostname = '') {
  const host = hostname.toLowerCase().replace(/\.$/, '')
  if (host.endsWith('.cat')) return 'ca'
  if (host.endsWith('.es')) return 'es'
  if (host.endsWith('.com')) return 'en'
  return null
}

/**
 * Precedence: ?lang= override > the visitor's saved choice > the domain >
 * the browser's languages > English.
 */
function detect() {
  // ?lang= is treated as an explicit choice, so it survives further navigation.
  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  if (isSupported(fromQuery)) {
    localStorage.setItem(STORAGE_KEY, fromQuery)
    return fromQuery
  }

  const saved = localStorage.getItem(STORAGE_KEY)
  if (isSupported(saved)) return saved

  const fromHost = localeFromHost(window.location.hostname)
  if (fromHost) return fromHost

  const fromBrowser = (navigator.languages ?? [navigator.language ?? ''])
    .map((tag) => tag.split('-')[0])
    .find(isSupported)

  return fromBrowser ?? FALLBACK
}

export const locale = ref(detect())

function applyDocumentLang(code) {
  document.documentElement.lang = code
}

applyDocumentLang(locale.value)

export function setLocale(code) {
  if (!isSupported(code)) return
  locale.value = code
  localStorage.setItem(STORAGE_KEY, code)
  applyDocumentLang(code)
}

const resolve = (bundle, key) =>
  key.split('.').reduce((value, part) => (value == null ? undefined : value[part]), bundle)

/**
 * UI strings: t('nav.about'). Supports {placeholders}:
 *   t('music.albumCount', { shown: 3, total: 10 })
 * Falls back to English, then to the key itself, so a missing translation is
 * visible but never breaks the page.
 */
export function t(key, params) {
  const raw = resolve(messages[locale.value], key) ?? resolve(messages[FALLBACK], key) ?? key
  if (!params || typeof raw !== 'string') return raw
  return raw.replace(/\{(\w+)\}/g, (match, name) => (name in params ? params[name] : match))
}

/**
 * Content fields from src/data/*. A field may be a plain value (same in every
 * language) or a { en, es, ca } object — pick() resolves both, so you only
 * translate what actually differs.
 */
export function pick(field) {
  if (field === null || typeof field !== 'object' || Array.isArray(field)) return field
  return field[locale.value] ?? field[FALLBACK] ?? null
}

export function useI18n() {
  return {
    locale,
    locales: LOCALES,
    current: computed(() => LOCALES.find((entry) => entry.code === locale.value)),
    setLocale,
    t,
    pick,
  }
}
