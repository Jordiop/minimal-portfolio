<script>
export const route = { titleKey: 'titles.post' }
</script>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { findPost, siblings, versionFor, formatDate } from '@/data/blog'
import { useI18n } from '@/i18n'
import { useSeo } from '@/composables/useSeo'
import PageHead from '@/components/PageHead.vue'

const currentRoute = useRoute()
const { t, locale, setLocale } = useI18n()

const post = computed(() => findPost(currentRoute.params.slug))
const version = computed(() => (post.value ? versionFor(post.value, locale.value) : null))
const neighbours = computed(() => siblings(currentRoute.params.slug))

// Bodies are code-split per post and language; the list page never loads them.
const html = ref('')
watchEffect(async () => {
  const load = version.value?.load
  html.value = ''
  if (!load) return
  const body = await load()
  // Ignore a slow load that finished after the reader switched post or language.
  if (version.value?.load === load) html.value = body
})

useSeo(() => ({
  title: version.value ? version.value.meta.title : t('blog.notFoundTitle'),
  description: version.value ? version.value.meta.description : t('blog.notFoundLede'),
  image: version.value?.meta.cover ?? undefined,
  type: 'article',
}))
</script>

<template>
  <article v-if="post && version" class="rise">
    <PageHead
      :index="`${t('titles.post')} — ${formatDate(version.meta.date, locale)}`"
      :title="version.meta.title"
      :lede="version.meta.description"
    >
      <div class="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <RouterLink to="/blog" class="link-draw text-[13px] text-muted">{{ t('blog.back') }}</RouterLink>
        <span class="label">{{ t('blog.minutes', { n: version.meta.minutes }) }}</span>
        <span v-for="tag in version.meta.tags" :key="tag" class="label">{{ tag }}</span>
      </div>
    </PageHead>

    <!-- Language notice: English-only post, or a translation of the English original. -->
    <p v-if="version.isFallback" class="border-b border-rule py-4 text-[13px] text-muted">
      {{ t('blog.englishOnlyNotice') }}
    </p>
    <p v-else-if="!version.isOriginal" class="border-b border-rule py-4 text-[13px] text-muted">
      {{ t('blog.translatedNotice') }}
      <button type="button" class="link-draw text-accent" @click="setLocale('en')">
        {{ t('blog.readOriginal') }}
      </button>
    </p>

    <img
      v-if="version.meta.cover"
      :src="version.meta.cover"
      alt=""
      class="mt-10 w-full border border-rule"
    />

    <!-- eslint-disable-next-line vue/no-v-html — author-written Markdown, rendered at build time -->
    <div class="prose py-14" :lang="version.meta.locale" v-html="html" />

    <nav class="grid border-t border-rule sm:grid-cols-2">
      <RouterLink v-if="neighbours.newer" :to="`/blog/${neighbours.newer.slug}`" class="group py-8 pr-6">
        <p class="label">{{ t('blog.newer') }}</p>
        <p class="mt-2 text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-accent">
          {{ versionFor(neighbours.newer, locale).meta.title }}
        </p>
      </RouterLink>
      <span v-else />

      <RouterLink
        v-if="neighbours.older"
        :to="`/blog/${neighbours.older.slug}`"
        class="group py-8 sm:border-l sm:border-rule sm:pl-8 sm:text-right"
      >
        <p class="label">{{ t('blog.older') }}</p>
        <p class="mt-2 text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-accent">
          {{ versionFor(neighbours.older, locale).meta.title }}
        </p>
      </RouterLink>
    </nav>
  </article>

  <div v-else class="rise">
    <PageHead index="Error — 404" :title="t('blog.notFoundTitle')" :lede="t('blog.notFoundLede')" />
    <RouterLink to="/blog" class="link-draw mt-8 inline-block text-accent">{{ t('blog.back') }}</RouterLink>
  </div>
</template>
