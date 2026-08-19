# Portfolio

A monospace portfolio built with **Vue 3 + Vite + Tailwind CSS v4**, set entirely in
[Courier Prime](https://fonts.google.com/specimen/Courier+Prime). Light and dark themes,
file-based routing, no component library.

```bash
npm install
cp .env.example .env   # optional — only the photo gallery needs it
npm run dev            # http://localhost:5173
npm run build          # -> dist/
npm run preview
```

## Pages

| route              | file                          |
| ------------------ | ----------------------------- |
| `/`                | `src/pages/index.vue`         |
| `/projects`        | `src/pages/projects/index.vue`|
| `/projects/:slug`  | `src/pages/projects/[slug].vue` |
| `/about`           | `src/pages/about.vue`         |
| `/music`           | `src/pages/music.vue`         |
| `/gallery`         | `src/pages/gallery.vue`       |
| anything else      | `src/pages/[...path].vue`     |

## How it is organised

```
src/
  pages/          every .vue file here becomes a route
  components/     shared UI (header, footer, page head, project row)
  composables/    useTheme · useGallery · useGithubStats · useSpotifyNowPlaying
  data/           site.js · projects.js · albums.js   <- your content
  i18n/           index.js + en.js · es.js · ca.js    <- your translations
  router/         builds the routes from src/pages
  style.css       design tokens + base styles
```

## Adding a project

Append one object to `projects` in `src/data/projects.js`. Nothing else needs touching —
the home page, the `/projects` list, the tech filters, the detail page and the prev/next
links all read from that array.

```js
{
  slug: 'my-thing',                 // -> /projects/my-thing
  title: 'My Thing',
  description: 'One sentence, shown in the list.',
  tech: ['Vue 3', 'Postgres'],      // these also become filter chips
  year: 2026,
  featured: true,                   // show it on the home page
  finished: false,                  // renders an "In progress" marker
  github: 'https://github.com/…',
  demo: 'https://…',
}
```

Everything below `year` is optional. Add any of these and the detail page grows the
matching section; leave them out and it silently omits them:

| field           | renders as                          |
| --------------- | ----------------------------------- |
| `role`          | spec table entry                    |
| `durationLabel` | spec table entry                    |
| `problem`       | "The problem"                       |
| `approach`      | "The approach"                      |
| `outcome`       | "The outcome"                       |
| `learnings`     | "What I learned" bullet list        |
| `metrics`       | the big numbers in the sidebar      |

Projects are keyed by `slug`, not by a numeric id, so adding one never means renumbering
anything.

## Adding a page

Drop a file into `src/pages`. That is the whole process.

```vue
<!-- src/pages/writing.vue  ->  /writing -->
<script>
export const route = { title: 'Writing', label: 'writing', nav: true, order: 6 }
</script>

<script setup>
import PageHead from '@/components/PageHead.vue'
</script>

<template>
  <div class="rise">
    <PageHead index="06 — Writing" title="Writing" lede="Notes and essays." />
  </div>
</template>
```

The optional `route` export tells the site what to do with the page:

| key     | meaning                                    |
| ------- | ------------------------------------------ |
| `title` | document title (`Writing — Jordi Osarenkhoe`) |
| `label` | text shown in the header nav               |
| `nav`   | `true` to add it to the header             |
| `order` | position in the header nav                 |

Filename conventions: `index.vue` → `/`, `about.vue` → `/about`, `projects/index.vue` →
`/projects`, `projects/[slug].vue` → `/projects/:slug`, `[...path].vue` → catch-all.

## Editing content

- `src/data/site.js` — name, role, bio, social links, skills, experience, education,
  interests. Start here.
- `src/data/projects.js` — the project list (above).
- `src/data/albums.js` — the `/music` list. Add an object, it appears.
- `public/resume.pdf` — the file behind the About page's download button.
- `src/assets/images/meirl.jpg` — the portrait on the home page.

## Languages

The site ships in **English, Spanish and Catalan**, with a selector in the header.

### How the language is chosen

In order, first match wins:

1. `?lang=en|es|ca` in the URL — treated as an explicit choice and remembered.
2. The visitor's saved choice (`localStorage`, key `portfolio-locale`).
3. **The domain**: `.cat` → Catalan, `.es` → Spanish, `.com` → English.
4. The browser's `Accept-Language`, if it matches a supported language.
5. English.

So `jordiop.cat` opens in Catalan and `jordiop.es` in Spanish without any
configuration, but a visitor who picks a language keeps it. `localStorage` is
per-origin, so the three domains never fight over the same saved choice.

Anything that is not one of those three TLDs (localhost, `*.vercel.app`, preview
URLs) falls through to the browser language. `?lang=ca` is the easy way to check
a translation locally.

### Adding or editing translations

UI strings live in `src/i18n/en.js`, `es.js` and `ca.js` — one file per language,
same shape in each:

```js
// src/i18n/es.js
export default {
  nav: { home: 'inicio', projects: 'proyectos', ... },
  about: { heading: 'Sobre mí', ... },
}
```

Use them with `t('about.heading')`. Placeholders are supported:

```js
t('music.albumCount', { shown: 3, total: 10 })   // "3 de 10 álbumes"
```

A missing key falls back to English, then to the key itself — so an untranslated
string is visible but never breaks the page.

### Translating content

Content in `src/data/` is translated in place. Any prose field can be a plain
value or a `{ en, es, ca }` object, and `pick()` resolves both:

```js
{
  slug: 'weather-app',
  title: 'Mood Tracker',                        // same in every language
  tech: ['Flutter', 'Dart'],                    // never translated
  description: {                                // translated
    en: 'A cross-platform weather application…',
    es: 'Una aplicación del tiempo multiplataforma…',
    ca: 'Una aplicació del temps multiplataforma…',
  },
}
```

That means adding a project is still one object in one file — you just write the
prose three times instead of once, and you can leave a field as a plain string
whenever the three languages agree.

### Adding a fourth language

1. Copy `src/i18n/en.js` to `src/i18n/fr.js` and translate it.
2. Register it in `src/i18n/index.js`: import it, add it to `messages`, and add
   `{ code: 'fr', label: 'FR', name: 'Français' }` to `LOCALES`.
3. Add `fr:` keys to the prose fields in `src/data/`. Anything you miss falls
   back to English.
4. Optionally map a TLD to it in `localeFromHost()`.

The header selector and the language detection both read `LOCALES`, so nothing
else needs touching.

> **SEO note:** all three languages share one URL per page, so a crawler only
> sees the language its domain resolves to. That is a reasonable fit for three
> separate domains. If you later want all three indexed from one domain, the
> change is path-prefixed routes (`/es/projects`) plus `hreflang` tags.

## Theming

Two blocks in `src/style.css` define everything:

```css
:root { --paper: #f2efe9; --ink: #16150f; --accent: #b23a15; … }
.dark { --paper: #111110; --ink: #e9e6de; --accent: #e8623a; … }
```

They are exposed to Tailwind through `@theme inline`, so `bg-paper`, `text-ink`,
`text-muted`, `border-rule` and `text-accent` switch themes automatically. Change the
accent in those two lines and the whole site follows.

`useTheme()` (`src/composables/useTheme.js`) holds the state:

```js
const { theme, isDark, toggleTheme, useSystemTheme } = useTheme()
```

The choice is stored in `localStorage` under `portfolio-theme`, and the OS preference is
used until the visitor picks one. A tiny inline script in `index.html` applies the class
before first paint so there is no flash of the wrong theme.

## Live data

- **GitHub stats** on `/about` come from the public, unauthenticated GitHub API and are
  cached in `localStorage` for 15 minutes. The username is `site.github`. No token needed.
- **The photo gallery** on `/gallery` lists a Cloudflare R2 bucket through a worker.
  Set `VITE_R2_PUBLIC_URL` and `VITE_R2_LIST_ENDPOINT` in `.env` (see `.env.example`);
  without them the page shows a notice instead of failing.

## SEO

Per-route, per-language metadata is written by `useSeo()`
(`src/composables/useSeo.js`), called once from `App.vue`. On every route or
language change it rewrites:

- `<title>` and `<meta name="description">`
- `og:*` and `twitter:*` (title, description, url, image, locale, type)
- `<link rel="canonical">` pointing at **that language's own domain**
- `<link rel="alternate" hreflang>` for all three domains, plus `x-default`
- `<html lang>`

Domains are configured in one place, `src/config/seo.js`:

```js
export const ORIGINS = {
  en: 'https://jordiop.com',
  es: 'https://jordiop.es',
  ca: 'https://jordiop.cat',
}
```

So a Spanish visitor on `/projects/forza-telemetry` gets a canonical of
`https://jordiop.es/projects/forza-telemetry` and hreflang alternates telling
Google where the English and Catalan versions live. That is exactly the signal
a multi-domain, single-language-per-domain site needs.

### Page descriptions

Static pages declare a `descriptionKey` alongside their `titleKey`:

```js
export const route = { titleKey: 'titles.about', descriptionKey: 'seo.about', ... }
```

The strings live under `seo:` in the three `src/i18n/*.js` files. A project
detail page overrides both with the project's own title and description via
`useSeo(() => ({ ... }))` — one page can override, but only `App.vue` ever
writes to the document, so nothing races.

### sitemap.xml and robots.txt

Both are **generated**, not hand-maintained. `npm run build` runs
`scripts/generate-sitemap.mjs` first (via `prebuild`), which walks `src/pages`
for static routes and expands `src/data/projects.js` for the project pages, then
emits every URL on all three domains with full hreflang alternates.

Add a project or a page and the sitemap picks it up on the next build. Run it on
its own with `npm run sitemap`.

> Submit the sitemap in Google Search Console for **each** of the three domains,
> and verify all three properties — cross-domain sitemap entries are only trusted
> from verified properties.

### Structured data

`index.html` carries `Person` and `WebSite` JSON-LD — job title, location,
employer, skills and `sameAs` links to GitHub, LinkedIn and Twitter.

## Deploying

A static SPA — `dist/` can go anywhere. Deep links such as `/projects/portfolio` need the
host to fall back to `index.html`; `vercel.json` does that for Vercel, and
Netlify/Cloudflare want the equivalent `_redirects` rule.
