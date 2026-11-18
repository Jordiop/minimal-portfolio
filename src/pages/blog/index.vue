<script>
export const route = { titleKey: 'titles.blog', descriptionKey: 'seo.blog', labelKey: 'nav.blog', icon: 'pen', nav: true, order: 3 }
</script>

<script setup>
import { computed, ref } from 'vue'
import { posts, versionFor, availableLocales, formatDate } from '@/data/blog'
import { useI18n } from '@/i18n'
import PageHead from '@/components/PageHead.vue'

const { t, locale } = useI18n()

// null means "no filter", same as the projects page.
const active = ref(null)

const rows = computed(() =>
  posts.map((post) => ({
    slug: post.slug,
    ...versionFor(post, locale.value),
    locales: availableLocales(post),
  })),
)

const tags = computed(() => [...new Set(rows.value.flatMap((row) => row.meta.tags))])

const filtered = computed(() =>
  active.value === null ? rows.value : rows.value.filter((row) => row.meta.tags.includes(active.value)),
)
</script>

<template>
  <div class="rise">
    <PageHead :index="`02 — ${t('titles.blog')}`" :title="t('blog.heading')" :lede="t('blog.lede')" />

    <section v-if="tags.length" class="flex flex-wrap gap-x-4 gap-y-2 border-b border-rule py-4">
      <button
        type="button"
        class="text-[11px] uppercase tracking-[0.18em] transition-colors duration-300"
        :class="active === null ? 'text-accent' : 'text-muted hover:text-ink'"
        @click="active = null"
      >
        {{ active === null ? '● ' : '○ ' }}{{ t('blog.all') }}
      </button>

      <button
        v-for="tag in tags"
        :key="tag"
        type="button"
        class="text-[11px] uppercase tracking-[0.18em] transition-colors duration-300"
        :class="active === tag ? 'text-accent' : 'text-muted hover:text-ink'"
        @click="active = tag"
      >
        {{ active === tag ? '● ' : '○ ' }}{{ tag }}
      </button>
    </section>

    <section class="pt-4">
      <RouterLink
        v-for="row in filtered"
        :key="row.slug"
        :to="`/blog/${row.slug}`"
        class="group grid grid-cols-1 gap-y-2 border-b border-rule py-6 transition-colors duration-300 hover:border-accent sm:grid-cols-[8rem_1fr] sm:gap-x-6"
      >
        <span class="text-[13px] text-faint transition-colors duration-300 group-hover:text-accent">
          <time :datetime="row.meta.date">{{ formatDate(row.meta.date, locale) }}</time>
        </span>

        <span class="min-w-0">
          <span class="flex flex-wrap items-baseline gap-x-3">
            <span
              class="text-xl font-bold tracking-tight transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-accent sm:text-2xl"
            >
              {{ row.meta.title }}
            </span>
            <span v-if="row.meta.draft" class="label text-accent">{{ t('blog.draft') }}</span>
          </span>

          <span v-if="row.meta.description" class="mt-1 block max-w-[52ch] text-[13px] leading-relaxed text-muted">
            {{ row.meta.description }}
          </span>

          <span class="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            <span class="label">{{ t('blog.minutes', { n: row.meta.minutes }) }}</span>
            <span v-for="tag in row.meta.tags" :key="tag" class="label">{{ tag }}</span>
            <span v-if="row.isFallback" class="label text-faint">{{ t('blog.englishOnly') }}</span>
          </span>
        </span>
      </RouterLink>

      <p v-if="!filtered.length" class="py-12 text-muted">
        {{ active === null ? t('blog.empty') : t('blog.emptyTag', { tag: active }) }}
      </p>
    </section>
  </div>
</template>
