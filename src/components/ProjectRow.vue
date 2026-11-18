<script setup>
import { useI18n } from '@/i18n'

defineProps({
  project: { type: Object, required: true },
})

const { t, pick } = useI18n()
</script>

<template>
  <RouterLink
    :to="`/projects/${project.slug}`"
    class="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-rule py-6 transition-colors duration-300 hover:border-accent sm:gap-x-6"
  >
    <span class="min-w-0">
      <span class="flex flex-wrap items-baseline gap-x-3">
        <span
          class="text-xl font-bold tracking-tight transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-accent sm:text-2xl"
        >
          {{ pick(project.title) }}
        </span>
        <span v-if="project.finished === false" class="label text-accent">
          {{ t('projects.inProgress') }}
        </span>
      </span>

      <span class="mt-1 block max-w-[52ch] text-[13px] leading-relaxed text-muted">
        {{ pick(project.description) }}
      </span>

      <span class="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        <span v-for="tech in project.tech" :key="tech" class="label">{{ tech }}</span>
      </span>
    </span>

    <span class="flex items-baseline gap-3 text-[13px] text-faint">
      <span>{{ project.year }}</span>
      <span
        aria-hidden="true"
        class="inline-block transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
      >↗</span>
    </span>
  </RouterLink>
</template>
