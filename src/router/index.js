import { createRouter, createWebHistory } from 'vue-router'

/**
 * File-based routing.
 *
 * Every `.vue` file in `src/pages` becomes a route — drop a file in, get a page.
 *
 *   pages/index.vue           ->  /
 *   pages/about.vue           ->  /about
 *   pages/projects/index.vue  ->  /projects
 *   pages/projects/[slug].vue ->  /projects/:slug
 *   pages/[...path].vue       ->  /:path(.*)   (catch-all, matched last)
 *
 * A page can describe itself by exporting `route` from a plain `<script>` block:
 *
 *   <script>
 *   export const route = { titleKey: 'titles.about', labelKey: 'nav.about', nav: true, order: 3 }
 *   </script>
 *
 * `titleKey`, `descriptionKey` and `labelKey` are i18n keys, so the document
 * title, the meta description and the header nav all follow the selected
 * language. The head itself is written by useSeo() — see src/composables/useSeo.js.
 */
const modules = import.meta.glob('../pages/**/*.vue', { eager: true })

function fileToPath(file) {
  const name = file.replace('../pages/', '').replace(/\.vue$/, '')

  let path =
    '/' +
    name
      .replace(/(^|\/)index$/, '') // index files map to their folder
      .replace(/\[\.\.\.(\w+)\]/g, ':$1(.*)') // [...path]  -> :path(.*)
      .replace(/\[(\w+)\]/g, ':$1') // [slug]     -> :slug

  path = path.replace(/\/+$/, '') || '/'
  return { name, path }
}

const routes = Object.entries(modules)
  .map(([file, module]) => {
    const { name, path } = fileToPath(file)
    const meta = module.route ?? {}

    return {
      path,
      name,
      component: module.default,
      meta: {
        titleKey: meta.titleKey ?? null,
        descriptionKey: meta.descriptionKey ?? null,
        labelKey: meta.labelKey ?? meta.titleKey ?? null,
        nav: meta.nav ?? false,
        order: meta.order ?? 99,
        ...meta,
      },
    }
  })
  // Catch-all routes have to be registered last.
  .sort((a, b) => Number(a.path.includes('(.*)')) - Number(b.path.includes('(.*)')))

/** Links for the header, derived from the pages that opt in with `nav: true`. */
export const navRoutes = routes
  .filter((route) => route.meta.nav)
  .sort((a, b) => a.meta.order - b.meta.order)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router
