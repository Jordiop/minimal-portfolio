/**
 * Generates public/sitemap.xml and public/robots.txt from the real route list
 * and the real project data, so neither can drift when a project is added.
 *
 * Runs automatically before `npm run build` (see package.json).
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { projects } from '../src/data/projects.js'
import { DEFAULT_LOCALE, LOCALE_TAGS, ORIGINS } from '../src/config/seo.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pagesDir = resolve(root, 'src/pages')

/** Static routes, discovered the same way the router discovers them. */
async function staticPaths(dir = pagesDir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true })
  const paths = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      paths.push(...(await staticPaths(resolve(dir, entry.name), `${prefix}/${entry.name}`)))
      continue
    }

    if (!entry.name.endsWith('.vue')) continue

    // Dynamic and catch-all segments are expanded from data, not listed as files.
    if (entry.name.includes('[')) continue

    const name = entry.name.replace(/\.vue$/, '')
    paths.push(name === 'index' ? prefix || '/' : `${prefix}/${name}`)
  }

  return paths
}

const priorityFor = (path) => {
  if (path === '/') return '1.0'
  if (path === '/projects') return '0.9'
  if (path === '/about') return '0.8'
  if (path.startsWith('/projects/')) return '0.7'
  return '0.5'
}

const paths = [
  ...(await staticPaths()).sort(),
  ...projects.map((project) => `/projects/${project.slug}`),
]

const url = (origin, path) => `${origin}${path === '/' ? '/' : path}`

const entries = paths.flatMap((path) =>
  Object.values(ORIGINS).map((origin) => {
    const alternates = Object.entries(ORIGINS)
      .map(
        ([code, alternateOrigin]) =>
          `    <xhtml:link rel="alternate" hreflang="${LOCALE_TAGS[code]}" href="${url(alternateOrigin, path)}"/>`,
      )
      .join('\n')

    return [
      '  <url>',
      `    <loc>${url(origin, path)}</loc>`,
      alternates,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(ORIGINS[DEFAULT_LOCALE], path)}"/>`,
      `    <priority>${priorityFor(path)}</priority>`,
      '  </url>',
    ].join('\n')
  }),
)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

${Object.values(ORIGINS)
  .map((origin) => `Sitemap: ${origin}/sitemap.xml`)
  .join('\n')}
`

await mkdir(resolve(root, 'public'), { recursive: true })
await writeFile(resolve(root, 'public/sitemap.xml'), sitemap, 'utf8')
await writeFile(resolve(root, 'public/robots.txt'), robots, 'utf8')

console.log(
  `sitemap: ${paths.length} paths x ${Object.keys(ORIGINS).length} locales = ${entries.length} urls`,
)
