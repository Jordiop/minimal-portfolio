<script>
export const route = { titleKey: 'titles.home', descriptionKey: 'seo.home', labelKey: 'nav.home', icon: 'house', nav: true, order: 1 }
</script>

<script setup>
import { onMounted, ref } from 'vue'
import { site } from '@/data/site'
import { useI18n } from '@/i18n'
import ForestScene from '@/components/ForestScene.vue'
import portrait from '@/assets/images/meirl.jpg'

const { t, pick } = useI18n()

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
    <!-- Hero: the whole landing fits in one screen -->
    <section
      class="relative isolate flex min-h-[calc(100svh-12rem)] flex-col justify-center pb-12 sm:min-h-[calc(100svh-14rem)]"
    >
      <ForestScene />

      <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div>
          <p class="label mb-6">{{ pick(site.greeting) }}</p>

          <!-- The invisible copy reserves the final size so the typing never pushes the layout. -->
          <h1 class="grid text-[clamp(2.75rem,8vw,5.5rem)]/[0.92] font-bold tracking-tighter">
            <span class="invisible col-start-1 row-start-1" aria-hidden="true">{{ site.name }}</span>
            <span class="col-start-1 row-start-1">
              {{ typed }}<span v-if="isTyping" class="caret ml-1" aria-hidden="true" />
            </span>
          </h1>

          <p class="mt-6 text-[13px] uppercase tracking-[0.18em] text-accent">
            {{ pick(site.role) }}
          </p>

          <p class="mt-6 max-w-[30ch] text-2xl leading-snug tracking-tight sm:text-3xl">
            {{ t('home.tagline') }}
          </p>

          <p class="mt-6 max-w-[52ch] text-base leading-relaxed text-muted">
            {{ pick(site.statement) }}
          </p>

          <div class="mt-10 flex flex-wrap gap-x-4 gap-y-3">
            <RouterLink
              to="/projects"
              class="border border-ink bg-ink px-5 py-2.5 text-[13px] text-paper transition-colors duration-300 hover:border-accent hover:bg-accent"
            >
              {{ t('home.seeMyWork') }}
            </RouterLink>
            <a
              :href="`mailto:${site.email}`"
              class="border border-rule px-5 py-2.5 text-[13px] transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              {{ t('home.getInTouch') }}
            </a>
          </div>
        </div>

        <figure
          class="group relative w-48 shrink-0 overflow-hidden border border-rule sm:w-64 lg:w-80"
        >
          <img
            :src="portrait"
            :alt="site.name"
            class="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <figcaption
            class="absolute inset-x-0 bottom-0 translate-y-full bg-paper/90 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted transition-transform duration-300 group-hover:translate-y-0"
          >
            {{ t('home.thatsMe') }}
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Status strip -->
    <section class="grid border-y border-rule sm:grid-cols-3">
      <div class="border-b border-rule py-6 sm:border-r sm:border-b-0 sm:pr-6">
        <p class="label">{{ t('home.currently') }}</p>
        <p class="mt-2 flex items-start gap-2.5 text-base leading-snug">
          <span class="relative mt-2 flex h-2 w-2 shrink-0" aria-hidden="true">
            <span class="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
            <span class="relative h-2 w-2 rounded-full bg-accent" />
          </span>
          {{ pick(site.available) }}
        </p>
      </div>
      <div class="border-b border-rule py-6 sm:border-r sm:border-b-0 sm:px-6">
        <p class="label">{{ t('home.basedIn') }}</p>
        <p class="mt-2 text-base leading-snug">{{ site.location }}</p>
      </div>
      <div class="py-6 sm:pl-6">
        <p class="label">{{ t('home.connect') }}</p>
        <ul class="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-base leading-snug">
          <li v-for="link in site.links" :key="link.label">
            <a :href="link.href" target="_blank" rel="noreferrer" class="link-draw">
              {{ link.label }} <span class="text-faint" aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
