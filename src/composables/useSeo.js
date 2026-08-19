import { onBeforeUnmount, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { locale, t } from '@/i18n'
import {
  DEFAULT_LOCALE,
  LOCALE_TAGS,
  OG_IMAGE,
  ORIGINS,
  SITE_NAME,
  TWITTER_HANDLE,
  absolute,
} from '@/config/seo'

/**
 * A page can override the computed title/description (a project detail page
 * describes the project, not the route). Exactly one effect writes to the
 * document — this ref is how pages feed into it, so nothing races.
 */
const override = ref(null)

function upsertMeta(key, attr, content) {
  const selector = `meta[${attr}="${key}"]`
  let element = document.head.querySelector(selector)

  if (!content) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

/** Link tags are keyed by rel + hreflang so alternates don't overwrite each other. */
function upsertLink(rel, href, hreflang) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`

  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    if (hreflang) element.setAttribute('hreflang', hreflang)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

function apply(path, currentLocale, custom) {
  const origin = ORIGINS[currentLocale] ?? ORIGINS[DEFAULT_LOCALE]
  const url = absolute(origin, path)

  const title = custom?.title ?? null
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ${t('seo.role')}`
  const description = custom?.description ?? ''
  const image = `${origin}${custom?.image ?? OG_IMAGE}`

  document.title = fullTitle

  upsertMeta('description', 'name', description)
  upsertMeta('robots', 'name', 'index, follow')

  upsertMeta('og:site_name', 'property', SITE_NAME)
  upsertMeta('og:type', 'property', custom?.type ?? 'website')
  upsertMeta('og:title', 'property', fullTitle)
  upsertMeta('og:description', 'property', description)
  upsertMeta('og:url', 'property', url)
  upsertMeta('og:image', 'property', image)
  upsertMeta('og:locale', 'property', LOCALE_TAGS[currentLocale])

  upsertMeta('twitter:card', 'name', 'summary_large_image')
  upsertMeta('twitter:site', 'name', TWITTER_HANDLE)
  upsertMeta('twitter:title', 'name', fullTitle)
  upsertMeta('twitter:description', 'name', description)
  upsertMeta('twitter:image', 'name', image)

  // Canonical points at this language's own domain…
  upsertLink('canonical', url)

  // …and hreflang tells search engines about the other two.
  for (const [code, alternateOrigin] of Object.entries(ORIGINS)) {
    upsertLink('alternate', absolute(alternateOrigin, path), LOCALE_TAGS[code])
  }
  upsertLink('alternate', absolute(ORIGINS[DEFAULT_LOCALE], path), 'x-default')
}

/**
 * Called once, from App.vue. Recomputes the document head whenever the route,
 * the language or a page's override changes.
 */
export function useSeoHead() {
  const route = useRoute()

  watchEffect(() => {
    const fallback = {
      title: route.meta.titleKey ? t(route.meta.titleKey) : null,
      description: route.meta.descriptionKey ? t(route.meta.descriptionKey) : '',
    }

    apply(route.path, locale.value, override.value ?? fallback)
  })
}

/**
 * Called from a page that knows better than its route meta — a project detail
 * page, say. The getter re-runs when its dependencies change, and the override
 * is dropped when the page unmounts.
 */
export function useSeo(getter) {
  watchEffect(() => {
    override.value = getter()
  })

  onBeforeUnmount(() => {
    override.value = null
  })
}
