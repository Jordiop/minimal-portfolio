import { readFile } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { postMeta, renderMarkdown, splitFrontMatter } from './scripts/lib/blog.mjs'

/**
 * Turns blog Markdown into JS modules at build time. Two flavours, picked by
 * query string, so the post list never pulls in post bodies:
 *
 *   post.md?meta  -> export default { slug, locale, title, date, … }
 *   post.md?html  -> export default '<p>…rendered body…</p>'
 *
 * See src/data/blog.js for the import.meta.glob calls that use them.
 */
function blogMarkdown() {
  let isBuild = false

  return {
    name: 'blog-markdown',
    enforce: 'pre',
    configResolved(config) {
      isBuild = config.command === 'build'
    },
    async load(id) {
      const match = id.match(/^(.*\.md)\?(meta|html)$/)
      if (!match) return null

      const [, file, kind] = match
      this.addWatchFile(file)
      const source = await readFile(file, 'utf8')
      const meta = postMeta(file, source)

      if (kind === 'meta') return `export default ${JSON.stringify(meta)}`

      // Drafts are listed in `vite dev` but never shipped in a production build.
      const html = isBuild && meta.draft ? '' : await renderMarkdown(splitFrontMatter(source).body)
      return `export default ${JSON.stringify(html)}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [blogMarkdown(), vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
