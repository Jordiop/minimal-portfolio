<script>
export const route = { titleKey: 'titles.about', descriptionKey: 'seo.about', labelKey: 'nav.about', nav: true, order: 4 }
</script>

<script setup>
import { computed, onMounted } from 'vue'
import { site, bio, skills, experience, education, interests } from '@/data/site'
import { useGithubStats } from '@/composables/useGithubStats'
import { useI18n } from '@/i18n'
import PageHead from '@/components/PageHead.vue'

const { t, pick } = useI18n()
const { stats, isLoading, error, fetchStats } = useGithubStats()

onMounted(() => fetchStats(site.github))

const paragraphs = computed(() => pick(bio) ?? [])
const interestList = computed(() => pick(interests) ?? [])

const cards = computed(() => [
  { key: 'repos', label: t('about.repos') },
  { key: 'stars', label: t('about.stars') },
  { key: 'followers', label: t('about.followers') },
  { key: 'following', label: t('about.following') },
])
</script>

<template>
  <div class="rise">
    <PageHead
      :index="`03 — ${t('titles.about')}`"
      :title="t('about.heading')"
      :lede="paragraphs[0]"
    >
      <a
        :href="site.resume"
        :download="site.resumeFilename"
        class="mt-8 inline-block border border-ink px-4 py-2 text-[13px] transition-colors duration-300 hover:border-accent hover:text-accent"
      >
        {{ t('about.downloadResume') }}
      </a>
    </PageHead>

    <section class="grid gap-12 py-14 sm:grid-cols-[1fr_14rem] sm:gap-16">
      <div class="max-w-[62ch] space-y-6 text-[15px] leading-[1.85]">
        <p
          v-for="(paragraph, index) in paragraphs"
          :key="index"
          :class="index === 0 ? 'text-lg leading-relaxed' : ''"
        >
          {{ paragraph }}
        </p>
      </div>

      <aside class="space-y-8 border-t border-rule pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
        <div v-for="group in skills" :key="pick(group.group)">
          <p class="label">{{ pick(group.group) }}</p>
          <ul class="mt-2 space-y-1 text-[13px] text-muted">
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </aside>
    </section>

    <!-- GitHub -->
    <section class="border-t border-rule pt-10">
      <div class="flex items-baseline justify-between">
        <h2 class="label">{{ t('about.github') }}</h2>
        <a
          :href="`https://github.com/${site.github}`"
          target="_blank"
          rel="noreferrer"
          class="link-draw text-[13px] text-muted"
        >
          {{ t('about.viewProfile') }}
        </a>
      </div>

      <p v-if="error" class="mt-4 text-[13px] text-muted">{{ error }}</p>

      <dl class="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div v-for="card in cards" :key="card.key" class="border-l border-rule pl-4">
          <dt class="label">{{ card.label }}</dt>
          <dd class="text-3xl font-bold tracking-tight">
            <span v-if="isLoading || !stats" class="text-faint">—</span>
            <span v-else>{{ stats[card.key] }}</span>
          </dd>
        </div>
      </dl>
    </section>

    <!-- Experience -->
    <section class="pt-16">
      <h2 class="label">{{ t('about.experience') }}</h2>
      <ul class="mt-6">
        <li
          v-for="job in experience"
          :key="job.company + pick(job.duration)"
          class="grid gap-2 border-b border-rule py-6 sm:grid-cols-[12rem_1fr] sm:gap-6"
        >
          <span class="text-[11px] uppercase tracking-[0.18em] text-faint">
            {{ pick(job.duration) }}
          </span>
          <span>
            <span class="block font-bold tracking-tight">{{ pick(job.role) }}</span>
            <span class="block text-[13px] text-accent">{{ job.company }}</span>
            <span class="mt-2 block max-w-[58ch] text-[13px] leading-relaxed text-muted">
              {{ pick(job.description) }}
            </span>
            <span class="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              <span v-for="tech in job.technologies" :key="tech" class="label">{{ tech }}</span>
            </span>
          </span>
        </li>
      </ul>
    </section>

    <!-- Education -->
    <section class="pt-16">
      <h2 class="label">{{ t('about.education') }}</h2>
      <ul class="mt-6">
        <li
          v-for="entry in education"
          :key="entry.institution"
          class="grid gap-2 border-b border-rule py-6 sm:grid-cols-[12rem_1fr] sm:gap-6"
        >
          <span class="text-[11px] uppercase tracking-[0.18em] text-faint">{{ entry.duration }}</span>
          <span>
            <span class="block font-bold tracking-tight">{{ pick(entry.degree) }}</span>
            <span class="block text-[13px] text-accent">{{ entry.institution }}</span>
            <span class="mt-2 block max-w-[58ch] text-[13px] leading-relaxed text-muted">
              {{ pick(entry.description) }}
            </span>
          </span>
        </li>
      </ul>
    </section>

    <!-- Interests -->
    <section class="pt-16">
      <h2 class="label">{{ t('about.interests') }}</h2>
      <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <li v-for="interest in interestList" :key="interest" class="text-[15px]">
          <span class="text-accent" aria-hidden="true">·</span> {{ interest }}
        </li>
      </ul>
    </section>

    <section class="pt-16">
      <p class="label">{{ t('about.contactHeading') }}</p>
      <p class="mt-4 max-w-[44ch] text-2xl leading-snug tracking-tight sm:text-3xl">
        {{ t('about.contactLine') }}
        <a :href="`mailto:${site.email}`" class="link-draw text-accent">{{
          t('about.contactEmail')
        }}</a>.
      </p>
    </section>
  </div>
</template>
