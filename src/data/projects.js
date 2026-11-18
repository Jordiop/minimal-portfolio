/**
 * The project list, read from src/content/projects — edited in Sveltia CMS at
 * /admin/ (or by hand). One JSON file per project and language:
 *
 *   portfolio-v2.json     English, always present — the filename is the slug
 *   portfolio-v2.es.json  Spanish translation, optional
 *   portfolio-v2.ca.json  Catalan translation, optional
 *
 * The files are merged back into the shape the pages already use: prose fields
 * become { en, es, ca } objects that pick() from @/i18n resolves, falling back
 * to English for anything that isn't translated.
 *
 *   order         list position, ascending
 *   featured      shows on the home page
 *   finished      false renders an "in progress" marker
 *   problem       \
 *   approach       > the case study, rendered in this order
 *   outcome       /
 *   learnings     bulleted list
 *   metrics       the numbers shown in the sidebar
 */
const files = import.meta.glob('/src/content/projects/*.json', { eager: true, import: 'default' })

const TRANSLATABLE = ['title', 'description', 'role', 'durationLabel', 'problem', 'approach', 'outcome', 'learnings']

/** `/src/content/projects/git-viewer.es.json` -> ['git-viewer', 'es'] */
function fileInfo(path) {
  const name = path.split('/').pop().replace(/\.json$/, '')
  const match = name.match(/^(.*)\.(es|ca)$/)
  return match ? [match[1], match[2]] : [name, 'en']
}

const bySlug = {}
for (const [path, data] of Object.entries(files)) {
  const [slug, locale] = fileInfo(path)
  ;(bySlug[slug] ??= {})[locale] = data
}

function merge(slug, versions) {
  const { en, ...translations } = versions
  const project = { ...en, slug }

  for (const key of TRANSLATABLE) {
    if (en[key] == null) continue
    project[key] = { en: en[key] }
    for (const [locale, data] of Object.entries(translations)) {
      if (data[key] != null && data[key] !== '') project[key][locale] = data[key]
    }
  }

  // Metrics are a list per language; zip them by position into { label: {…}, value: {…} }.
  project.metrics = (en.metrics ?? []).map((metric, index) => {
    const merged = { label: { en: metric.label }, value: { en: metric.value } }
    for (const [locale, data] of Object.entries(translations)) {
      const translated = data.metrics?.[index]
      if (translated?.label) merged.label[locale] = translated.label
      if (translated?.value) merged.value[locale] = translated.value
    }
    return merged
  })

  return project
}

export const projects = Object.entries(bySlug)
  .filter(([, versions]) => versions.en)
  .map(([slug, versions]) => merge(slug, versions))
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

export function findProject(slug) {
  return projects.find((project) => project.slug === slug) ?? null
}

export function featuredProjects() {
  return projects.filter((project) => project.featured)
}

export function siblings(slug) {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1) return { previous: null, next: null }
  return {
    previous: projects[index - 1] ?? null,
    next: projects[index + 1] ?? null,
  }
}
