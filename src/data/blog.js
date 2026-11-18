/**
 * Blog posts, read from src/content/blog at build time (see the blog-markdown
 * plugin in vite.config.js). Posts are written and edited in Sveltia CMS at
 * /admin/ — or by hand: drop a Markdown file into src/content/blog.
 *
 * Every post is written in English (`slug.md`). Spanish and Catalan versions
 * (`slug.es.md`, `slug.ca.md`) are optional; a visitor whose language has no
 * translation reads the English original with a notice.
 */

// Kept in sync with scripts/lib/blog.mjs — not imported from there, because
// that module pulls in the build-time Markdown toolchain.
const DEFAULT_LOCALE = 'en'

const metaModules = import.meta.glob('/src/content/blog/*.md', {
  query: '?meta',
  import: 'default',
  eager: true,
})

const htmlLoaders = import.meta.glob('/src/content/blog/*.md', {
  query: '?html',
  import: 'default',
})

const showDrafts = !import.meta.env.PROD

/** slug -> { slug, versions: { en: meta, es?: meta, ca?: meta }, loaders } */
const bySlug = new Map()

for (const [file, meta] of Object.entries(metaModules)) {
  if (!bySlug.has(meta.slug)) bySlug.set(meta.slug, { slug: meta.slug, versions: {}, loaders: {} })
  const entry = bySlug.get(meta.slug)
  entry.versions[meta.locale] = meta
  entry.loaders[meta.locale] = htmlLoaders[file]
}

/** Posts with an English original, newest first. Drafts only outside production. */
export const posts = [...bySlug.values()]
  .filter((entry) => entry.versions[DEFAULT_LOCALE])
  .filter((entry) => showDrafts || !entry.versions[DEFAULT_LOCALE].draft)
  .sort((a, b) =>
    (b.versions[DEFAULT_LOCALE].date ?? '').localeCompare(a.versions[DEFAULT_LOCALE].date ?? ''),
  )

export function findPost(slug) {
  return posts.find((post) => post.slug === slug) ?? null
}

/**
 * The version to show for a language: the translation if it exists, otherwise
 * the English original. `translated` says which one you got.
 */
export function versionFor(post, locale) {
  const meta = post.versions[locale] ?? post.versions[DEFAULT_LOCALE]
  return {
    meta,
    isOriginal: meta.locale === DEFAULT_LOCALE,
    isFallback: meta.locale !== locale,
    load: post.loaders[meta.locale],
  }
}

export function availableLocales(post) {
  return Object.keys(post.versions)
}

/** Older / newer neighbours, in list order. */
export function siblings(slug) {
  const index = posts.findIndex((post) => post.slug === slug)
  if (index === -1) return { newer: null, older: null }
  return { newer: posts[index - 1] ?? null, older: posts[index + 1] ?? null }
}

export function formatDate(iso, locale) {
  if (!iso) return ''
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(`${iso}T00:00:00`),
  )
}
