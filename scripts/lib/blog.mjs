/**
 * Blog post parsing, shared by the Vite plugin (vite.config.js) and the
 * sitemap script, so both read posts exactly the same way.
 *
 * Posts live in src/content/blog and are written by Sveltia CMS
 * (public/admin/config.yml) using its `multiple_files` i18n structure:
 *
 *   hello-world.md      English — the original, always present
 *   hello-world.es.md   Spanish translation, optional
 *   hello-world.ca.md   Catalan translation, optional
 *
 * Each file is YAML front matter followed by a Markdown body.
 */
import { readFile, readdir } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { Marked } from 'marked'
import { bundledLanguages, codeToHtml } from 'shiki'

export const DEFAULT_LOCALE = 'en'
export const TRANSLATION_LOCALES = ['es', 'ca']

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/
const WORDS_PER_MINUTE = 220

/** `hello-world.es.md` -> { slug: 'hello-world', locale: 'es' } */
export function fileInfo(file) {
  const name = basename(file).replace(/\.md$/, '')
  const match = name.match(/^(.*)\.([a-z]{2})$/)

  if (match && TRANSLATION_LOCALES.includes(match[2])) {
    return { slug: match[1], locale: match[2] }
  }
  return { slug: name, locale: DEFAULT_LOCALE }
}

export function splitFrontMatter(source) {
  const match = source.match(FRONT_MATTER)
  if (!match) return { data: {}, body: source }
  return { data: parseYaml(match[1]) ?? {}, body: match[2] }
}

/** Dates come out of YAML as Date objects or strings; normalise to YYYY-MM-DD. */
function toIsoDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10)
}

/** Only the fields the list page needs — no body, so it stays small. */
export function postMeta(file, source) {
  const { slug, locale } = fileInfo(file)
  const { data, body } = splitFrontMatter(source)
  const words = body.trim().split(/\s+/).filter(Boolean).length

  return {
    slug,
    locale,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: toIsoDate(data.date),
    updated: toIsoDate(data.updated),
    tags: Array.isArray(data.tags) ? data.tags : [],
    cover: data.cover ?? null,
    draft: data.draft === true,
    minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  }
}

/**
 * Code blocks are highlighted at build time with both themes baked in, so the
 * browser ships no highlighter. style.css switches between them with .dark.
 */
const marked = new Marked({
  async: true,
  gfm: true,
  async walkTokens(token) {
    if (token.type !== 'code') return

    const lang = token.lang && token.lang in bundledLanguages ? token.lang : 'text'
    const html = await codeToHtml(token.text, {
      lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })

    Object.assign(token, { type: 'html', block: true, text: html })
  },
})

export async function renderMarkdown(body) {
  return marked.parse(body)
}

/** Every post file on disk, parsed to metadata. Used by the sitemap. */
export async function listPostMeta(dir) {
  const files = (await readdir(dir).catch(() => [])).filter((file) => file.endsWith('.md'))

  return Promise.all(
    files.map(async (file) => postMeta(file, await readFile(resolve(dir, file), 'utf8'))),
  )
}
