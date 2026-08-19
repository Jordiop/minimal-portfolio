<script>
export const route = { titleKey: 'titles.project' }
</script>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findProject, siblings } from '@/data/projects'
import { useI18n } from '@/i18n'
import { useSeo } from '@/composables/useSeo'
import PageHead from '@/components/PageHead.vue'

const currentRoute = useRoute()
const { t, pick } = useI18n()

const project = computed(() => findProject(currentRoute.params.slug))
const neighbours = computed(() => siblings(currentRoute.params.slug))

/** Only the case-study sections that this project actually filled in. */
const sections = computed(() => {
  if (!project.value) return []
  return [
    { heading: t('project.problem'), body: pick(project.value.problem) },
    { heading: t('project.approach'), body: pick(project.value.approach) },
    { heading: t('project.outcome'), body: pick(project.value.outcome) },
  ].filter((section) => section.body)
})

const learnings = computed(() => pick(project.value?.learnings) ?? [])

useSeo(() => ({
  title: project.value ? pick(project.value.title) : t('project.notFoundTitle'),
  description: project.value ? pick(project.value.description) : t('project.notFoundLede'),
  type: 'article',
}))
</script>

<template>
  <article v-if="project" class="rise">
    <PageHead
      :index="`${t('titles.project')} — ${project.year}`"
      :title="pick(project.title)"
      :lede="pick(project.description)"
    >
      <RouterLink to="/projects" class="link-draw mt-8 inline-block text-[13px] text-muted">
        {{ t('project.back') }}
      </RouterLink>
    </PageHead>

    <!-- Spec table -->
    <section class="grid gap-x-8 gap-y-6 border-b border-rule py-8 sm:grid-cols-4">
      <div>
        <p class="label">{{ t('project.year') }}</p>
        <p class="mt-1 text-[13px]">{{ project.year }}</p>
      </div>
      <div v-if="project.role">
        <p class="label">{{ t('project.role') }}</p>
        <p class="mt-1 text-[13px]">{{ pick(project.role) }}</p>
      </div>
      <div v-if="project.durationLabel">
        <p class="label">{{ t('project.duration') }}</p>
        <p class="mt-1 text-[13px]">{{ pick(project.durationLabel) }}</p>
      </div>
      <div>
        <p class="label">{{ t('project.status') }}</p>
        <p class="mt-1 text-[13px]" :class="project.finished === false ? 'text-accent' : ''">
          {{ project.finished === false ? t('project.inProgress') : t('project.shipped') }}
        </p>
      </div>
    </section>

    <!-- Body -->
    <section class="grid gap-12 py-14 sm:grid-cols-[1fr_14rem] sm:gap-16">
      <div class="max-w-[62ch] space-y-10">
        <div v-for="section in sections" :key="section.heading" class="space-y-3">
          <h2 class="label">{{ section.heading }}</h2>
          <p class="text-[15px] leading-[1.85]">{{ section.body }}</p>
        </div>

        <div v-if="learnings.length" class="space-y-3">
          <h2 class="label">{{ t('project.learnings') }}</h2>
          <ul class="space-y-3">
            <li
              v-for="learning in learnings"
              :key="learning"
              class="grid grid-cols-[1.25rem_1fr] text-[15px] leading-[1.85]"
            >
              <span class="text-accent" aria-hidden="true">—</span>
              <span>{{ learning }}</span>
            </li>
          </ul>
        </div>

        <p v-if="!sections.length && !learnings.length" class="text-muted">
          {{ t('project.noWriteUp') }}
        </p>

        <div class="flex flex-wrap gap-x-6 gap-y-2 pt-2">
          <a
            v-if="project.demo"
            :href="project.demo"
            target="_blank"
            rel="noreferrer"
            class="link-draw text-accent"
          >
            {{ t('project.liveDemo') }}
          </a>
          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noreferrer"
            class="link-draw text-muted"
          >
            {{ t('project.source') }}
          </a>
        </div>
      </div>

      <aside class="space-y-8 border-t border-rule pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
        <div class="space-y-5">
          <div v-for="metric in project.metrics" :key="pick(metric.label)">
            <p class="label">{{ pick(metric.label) }}</p>
            <p class="text-2xl font-bold tracking-tight">{{ pick(metric.value) }}</p>
          </div>
        </div>

        <div>
          <p class="label">{{ t('project.builtWith') }}</p>
          <ul class="mt-2 space-y-1 text-[13px] text-muted">
            <li v-for="tech in project.tech" :key="tech">{{ tech }}</li>
          </ul>
        </div>
      </aside>
    </section>

    <!-- Prev / next -->
    <nav class="grid border-t border-rule sm:grid-cols-2">
      <RouterLink
        v-if="neighbours.previous"
        :to="`/projects/${neighbours.previous.slug}`"
        class="group py-8 pr-6"
      >
        <p class="label">{{ t('project.previous') }}</p>
        <p class="mt-2 text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-accent">
          {{ pick(neighbours.previous.title) }}
        </p>
      </RouterLink>
      <span v-else />

      <RouterLink
        v-if="neighbours.next"
        :to="`/projects/${neighbours.next.slug}`"
        class="group py-8 sm:border-l sm:border-rule sm:pl-8 sm:text-right"
      >
        <p class="label">{{ t('project.next') }}</p>
        <p class="mt-2 text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-accent">
          {{ pick(neighbours.next.title) }}
        </p>
      </RouterLink>
    </nav>
  </article>

  <div v-else class="rise">
    <PageHead
      index="Error — 404"
      :title="t('project.notFoundTitle')"
      :lede="t('project.notFoundLede')"
    />
    <RouterLink to="/projects" class="link-draw mt-8 inline-block text-accent">
      {{ t('project.back') }}
    </RouterLink>
  </div>
</template>
