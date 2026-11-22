<script setup>
import { useI18n } from '@/i18n'

defineProps({
  project: { type: Object, required: true },
})

const { t, pick } = useI18n()
</script>

<template>
  <RouterLink :to="`/projects/${project.slug}`" class="group flex flex-col">
    <!-- Cover, or a typographic stand-in until one is uploaded -->
    <div
      class="relative aspect-[16/10] overflow-hidden border border-rule bg-surface transition-colors duration-300 group-hover:border-accent"
    >
      <img
        v-if="project.cover"
        :src="project.cover"
        :alt="pick(project.title)"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div v-else class="flex h-full flex-col justify-between p-5 sm:p-6" aria-hidden="true">
        <span class="label">{{ project.tech?.[0] }}</span>
        <span
          class="text-[clamp(1.75rem,4vw,2.75rem)]/[0.95] font-bold tracking-tighter text-faint transition-colors duration-300 group-hover:text-ink"
        >
          {{ pick(project.title) }}
        </span>
      </div>

      <span
        v-if="project.finished === false"
        class="label absolute left-3 top-3 border border-accent bg-paper/90 px-2 py-0.5 !text-accent"
      >
        {{ t('projects.inProgress') }}
      </span>
      <span
        v-if="project.gallery?.length"
        class="label absolute bottom-3 right-3 bg-paper/90 px-2 py-0.5"
      >
        +{{ project.gallery.length }}
      </span>
    </div>

    <div class="mt-4 flex items-baseline justify-between gap-4">
      <h2
        class="text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-accent sm:text-2xl"
      >
        {{ pick(project.title) }}
      </h2>
      <span class="flex shrink-0 items-baseline gap-2 text-[13px] text-faint">
        {{ project.year }}
        <span
          aria-hidden="true"
          class="inline-block transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        >↗</span>
      </span>
    </div>

    <p class="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted">
      {{ pick(project.description) }}
    </p>

    <p class="mt-3 flex flex-wrap gap-x-3 gap-y-1">
      <span v-for="tech in project.tech" :key="tech" class="label">{{ tech }}</span>
    </p>
  </RouterLink>
</template>
