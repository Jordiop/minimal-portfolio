<script>
export const route = { titleKey: 'titles.projects', descriptionKey: 'seo.projects', labelKey: 'nav.projects', nav: true, order: 2 }
</script>

<script setup>
import { computed, ref } from 'vue'
import { projects } from '@/data/projects'
import { useI18n } from '@/i18n'
import PageHead from '@/components/PageHead.vue'
import ProjectRow from '@/components/ProjectRow.vue'

const { t } = useI18n()

// null means "no filter"; the label for that chip is translated at render time.
const active = ref(null)

const filters = computed(() => [...new Set(projects.flatMap((project) => project.tech))])

const filtered = computed(() =>
  active.value === null
    ? projects
    : projects.filter((project) => project.tech.includes(active.value)),
)
</script>

<template>
  <div class="rise">
    <PageHead
      :index="`01 — ${t('titles.projects')}`"
      :title="t('projects.heading')"
      :lede="t('projects.lede')"
    />

    <section class="flex flex-wrap gap-x-4 gap-y-2 border-b border-rule py-4">
      <button
        type="button"
        class="text-[11px] uppercase tracking-[0.18em] transition-colors duration-300"
        :class="active === null ? 'text-accent' : 'text-muted hover:text-ink'"
        @click="active = null"
      >
        {{ active === null ? '● ' : '○ ' }}{{ t('projects.all') }}
      </button>

      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="text-[11px] uppercase tracking-[0.18em] transition-colors duration-300"
        :class="active === filter ? 'text-accent' : 'text-muted hover:text-ink'"
        @click="active = filter"
      >
        {{ active === filter ? '● ' : '○ ' }}{{ filter }}
      </button>
    </section>

    <section class="pt-4">
      <ProjectRow
        v-for="(project, index) in filtered"
        :key="project.slug"
        :project="project"
        :index="index"
      />
      <p v-if="!filtered.length" class="py-12 text-muted">
        {{ t('projects.empty', { filter: active }) }}
      </p>
    </section>
  </div>
</template>
