/**
 * SEO configuration.
 *
 * Each language has its own domain, which is also how the language is chosen
 * (see src/i18n/index.js). That mapping drives both the canonical URL and the
 * hreflang alternates, so a page on jordiop.es tells search engines where its
 * English and Catalan twins live.
 */
export const SITE_NAME = 'Jordi Osarenkhoe'

export const ORIGINS = {
  en: 'https://jordiop.com',
  es: 'https://jordiop.es',
  ca: 'https://jordiop.cat',
}

/** The origin search engines should treat as the default for un-targeted users. */
export const DEFAULT_LOCALE = 'en'

/** Full BCP-47 tags for <html lang> and og:locale. */
export const LOCALE_TAGS = {
  en: 'en',
  es: 'es-ES',
  ca: 'ca-ES',
}

export const TWITTER_HANDLE = '@jordiscript'

/**
 * Social preview image, relative to the origin.
 * TODO: replace with a purpose-built 1200x630 image — favicon.png is square and
 * small, so it renders as a cropped thumbnail rather than a full-width card.
 */
export const OG_IMAGE = '/favicon.png'

export const absolute = (origin, path) => `${origin}${path === '/' ? '' : path}`
