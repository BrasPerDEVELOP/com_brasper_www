<template>
  <section class="bg-gradient-to-b from-white via-blue-50 to-slate-100 px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-5xl">
      <div class="mb-10 text-center">
        <span class="block text-sm font-semibold text-indigo-600">
          {{ t('landing_get_informed_title') }}
        </span>
        <h2 class="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">
          {{ t('landing_get_informed_subtitle') }}
        </h2>
      </div>

      <div class="relative">
        <article
          class="mx-auto flex flex-col items-center gap-6 rounded-[28px] bg-white p-6 shadow-xl transition-all duration-500 md:p-8"
          :class="isEvenSlide ? 'md:flex-row' : 'md:flex-row-reverse'"
        >
          <button
            type="button"
            class="group relative block w-full overflow-hidden rounded-2xl md:w-1/2"
            :aria-label="slide.alt"
            @click="openVideo(slide.videoSrc)"
          >
            <img
              :src="slide.thumbnail"
              :alt="slide.alt"
              class="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-slate-900/20 transition group-hover:bg-slate-900/30" />
            <div
              class="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl text-indigo-600 shadow-lg transition group-hover:scale-105"
            >
              ▶
            </div>
          </button>

          <div class="w-full text-center md:w-1/2 md:text-left">
            <h3 class="mb-3 text-2xl font-bold text-slate-800 sm:text-3xl">
              {{ slide.title }}
            </h3>
            <p class="mb-5 text-sm text-slate-600 sm:text-base">
              {{ slide.text }}
            </p>
            <ul class="mb-6 space-y-3 text-sm sm:text-base">
              <li
                v-for="item in slide.items"
                :key="item"
                class="flex items-center justify-center gap-2 text-slate-700 md:justify-start"
              >
                <span class="text-blue-600">✔</span>
                <span>{{ item }}</span>
              </li>
            </ul>
            <a
              :href="slide.channelUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:text-base"
            >
              {{ slide.buttonLabel }}
            </a>
          </div>
        </article>

        <button
          type="button"
          :aria-label="t('landing_get_informed_prev')"
          class="absolute -left-6 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300 bg-white text-xl text-cyan-500 shadow-lg transition duration-300 hover:bg-cyan-100 md:flex"
          @click="prev"
        >
          ‹
        </button>
        <button
          type="button"
          :aria-label="t('landing_get_informed_next')"
          class="absolute -right-6 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300 bg-white text-xl text-cyan-500 shadow-lg transition duration-300 hover:bg-cyan-100 md:flex"
          @click="next"
        >
          ›
        </button>

        <div class="mt-6 flex justify-center gap-2">
          <button
            v-for="(_, itemIndex) in slides"
            :key="`informed-dot-${itemIndex}`"
            type="button"
            class="h-3 rounded-full transition-all duration-300"
            :class="itemIndex === currentIndex ? 'w-8 bg-indigo-600' : 'w-3 bg-slate-300 hover:bg-slate-400'"
            :aria-label="`${t('landing_get_informed_go_to')} ${itemIndex + 1}`"
            @click="goTo(itemIndex)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="activeVideoSrc"
      class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 px-4 py-6"
      @click.self="closeVideo"
    >
      <div class="relative w-full max-w-5xl rounded-2xl bg-slate-950 p-2 shadow-2xl">
        <button
          type="button"
          :aria-label="t('close')"
          class="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          @click="closeVideo"
        >
          ✕
        </button>
        <iframe
          class="aspect-video w-full rounded-xl"
          :src="activeVideoSrc"
          :title="slide.title"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface InformedSlide {
  thumbnail: string
  videoSrc: string
  alt: string
  title: string
  text: string
  items: string[]
  buttonLabel: string
  channelUrl: string
}

const { t } = useI18n()

const currentIndex = ref(0)
const activeVideoSrc = ref('')

const slides = computed<InformedSlide[]>(() => [
  {
    thumbnail: '/assets/projects/img_video2.png',
    videoSrc: 'https://www.youtube.com/embed/r3lA3P9evjk?start=18&rel=0&autoplay=1',
    alt: t('landing_get_informed_slide_1_alt'),
    title: t('landing_get_informed_slide_1_title'),
    text: t('landing_get_informed_slide_1_text'),
    items: [
      t('landing_get_informed_slide_1_item_1'),
      t('landing_get_informed_slide_1_item_2')
    ],
    buttonLabel: t('landing_get_informed_button'),
    channelUrl: 'https://www.youtube.com/@BrasperTransferencias'
  },
  {
    thumbnail: '/assets/projects/img-video1.png',
    videoSrc: 'https://www.youtube.com/embed/DDQb7731Fn0?start=2&rel=0&autoplay=1',
    alt: t('landing_get_informed_slide_2_alt'),
    title: t('landing_get_informed_slide_2_title'),
    text: t('landing_get_informed_slide_2_text'),
    items: [
      t('landing_get_informed_slide_2_item_1'),
      t('landing_get_informed_slide_2_item_2')
    ],
    buttonLabel: t('landing_get_informed_button'),
    channelUrl: 'https://www.youtube.com/@BrasperTransferencias'
  }
])

const slide = computed(() => slides.value[currentIndex.value])
const isEvenSlide = computed(() => currentIndex.value % 2 === 0)

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
}

const goTo = (index: number) => {
  currentIndex.value = index
}

const openVideo = (videoSrc: string) => {
  activeVideoSrc.value = videoSrc
}

const closeVideo = () => {
  activeVideoSrc.value = ''
}

watch(activeVideoSrc, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>
