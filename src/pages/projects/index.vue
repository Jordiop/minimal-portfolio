<script>
export const route = { titleKey: 'titles.projects', descriptionKey: 'seo.projects', labelKey: 'nav.projects', icon: 'folder', nav: true, order: 2 }
</script>

<script setup>
import { projects } from '@/data/projects'
import { useI18n } from '@/i18n'
import PageHead from '@/components/PageHead.vue'
import ProjectRow from '@/components/ProjectRow.vue'

const { t } = useI18n()
</script>

<template>
  <div class="rise">
    <PageHead
      :index="`01 — ${t('titles.projects')}`"
      :title="t('projects.heading')"
      :lede="t('projects.lede')"
    />

    <section class="pt-4">
      <ProjectRow v-for="project in projects" :key="project.slug" :project="project" />
    </section>
  </div>
</template>
