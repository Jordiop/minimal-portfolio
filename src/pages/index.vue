<script>
export const route = { titleKey: 'titles.home', descriptionKey: 'seo.home', labelKey: 'nav.home', icon: 'house', nav: true, order: 1 }
</script>

<script setup>
import { onMounted, ref } from 'vue'
import { site } from '@/data/site'
import { featuredProjects } from '@/data/projects'
import { useI18n } from '@/i18n'
import ProjectRow from '@/components/ProjectRow.vue'
import ForestScene from '@/components/ForestScene.vue'
import portrait from '@/assets/images/meirl.jpg'

const { t, pick } = useI18n()

const featured = featuredProjects()

// Typewriter, in keeping with the face the whole site is set in.
const typed = ref('')
const isTyping = ref(false)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typed.value = site.name
    return
  }

  setTimeout(() => {
    isTyping.value = true
    let index = 0
    const type = () => {
      if (index < site.name.length) {
        typed.value += site.name.charAt(index)
        index += 1
        setTimeout(type, 70)
      } else {
        isTyping.value = false
      }
    }
    type()
  }, 400)
})
</script>

<template>
  <div class="rise">
    <!-- Hero -->
    <section class="relative isolate flex min-h-[78svh] flex-col justify-center border-b border-rule pb-14">
      <ForestScene />

      <p class="label mb-8">{{ pick(site.greeting) }}</p>

      <h1
        class="min-h-[1.1em] text-[clamp(2.5rem,9vw,5.5rem)]/[0.9] font-bold tracking-tighter"
      >
        {{ typed }}<span v-if="isTyping" class="caret ml-1" aria-hidden="true" />
      </h1>

      <p class="mt-8 max-w-[54ch] text-lg leading-relaxed">
        {{ t('home.tagline') }}
      </p>

      <div class="mt-10 flex flex-wrap items-start gap-8">
        <figure class="group relative w-40 shrink-0 overflow-hidden border border-rule sm:w-52">
          <img
            :src="portrait"
            :alt="site.name"
            class="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <figcaption
            class="absolute inset-x-0 bottom-0 translate-y-full bg-paper/90 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-muted transition-transform duration-300 group-hover:translate-y-0"
          >
            {{ t('home.thatsMe') }}
          </figcaption>
        </figure>

        <p class="max-w-[46ch] text-muted">{{ pick(site.statement) }}</p>
      </div>

      <div class="mt-10 flex flex-wrap gap-x-6 gap-y-3">
        <RouterLink
          to="/projects"
          class="border border-ink px-4 py-2 text-[13px] transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          {{ t('home.seeMyWork') }}
        </RouterLink>
        <a
          :href="`mailto:${site.email}`"
          class="border border-rule px-4 py-2 text-[13px] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          {{ t('home.getInTouch') }}
        </a>
      </div>
    </section>

    <!-- Status strip -->
    <section class="grid gap-6 border-b border-rule py-6 sm:grid-cols-3">
      <div>
        <p class="label">{{ t('home.currently') }}</p>
        <p class="mt-1 flex items-start gap-2 text-[13px]">
          <span class="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          {{ pick(site.available) }}
        </p>
      </div>
      <div>
        <p class="label">{{ t('home.basedIn') }}</p>
        <p class="mt-1 text-[13px]">{{ site.location }}</p>
      </div>
      <div>
        <p class="label">{{ t('home.connect') }}</p>
        <ul class="mt-1 flex flex-wrap gap-x-4 text-[13px]">
          <li v-for="link in site.links" :key="link.label">
            <a :href="link.href" target="_blank" rel="noreferrer" class="link-draw">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- Featured work -->
    <section class="pt-16">
      <div class="mb-2 flex items-baseline justify-between border-b border-rule pb-4">
        <h2 class="label">{{ t('home.featuredWork') }}</h2>
        <RouterLink to="/projects" class="link-draw text-[13px] text-muted">
          {{ t('home.allProjects') }}
        </RouterLink>
      </div>

      <ProjectRow v-for="project in featured" :key="project.slug" :project="project" />
    </section>

    <!-- Contact -->
    <section class="pt-20">
      <p class="label">{{ t('home.contactHeading') }}</p>
      <p class="mt-4 max-w-[44ch] text-2xl leading-snug tracking-tight sm:text-3xl">
        {{ t('home.contactLine') }}
        <a :href="`mailto:${site.email}`" class="link-draw text-accent">{{ t('home.sayHello') }}</a>
      </p>
    </section>
  </div>
</template>
