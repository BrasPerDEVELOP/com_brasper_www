<template>
  <section id="bancos-section" class="relative py-12 bg-white">
    <div class="mx-auto max-w-7xl px-4 text-center">
      <span class="block text-xs font-semibold text-gray-500 uppercase mb-2">
        {{ t('landing_section_banks_title') }}
      </span>
      <h2 class="text-2xl font-bold mb-6">{{ t('landing_section_banks_subtitle') }}</h2>

      <div
        class="relative mx-auto max-w-6xl"
        @mouseenter="pauseAutoplay"
        @mouseleave="startAutoplay"
      >
        <div
          class="slider-viewport"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
          @wheel.prevent="onWheel"
        >
          <div
            class="slider-track"
            :style="{
              transform: `translateX(-${translateX}%)`,
              '--slides-per-view': `${slidesPerView}`
            }"
          >
            <div v-for="banco in databancos" :key="banco.nombre" class="slider-slide">
              <a
                :href="banco.enlace"
                target="_blank"
                rel="noopener noreferrer"
                class="block cursor-pointer"
              >
                <img
                  :src="banco.img1"
                  :alt="banco.nombre"
                  class="mx-auto h-auto w-28 object-contain opacity-70 transition-opacity hover:opacity-100 md:w-32"
                />
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="nav-btn nav-btn-left"
          aria-label="Anterior"
          @click="prevSlide"
        >
          ‹
        </button>
        <button
          type="button"
          class="nav-btn nav-btn-right"
          aria-label="Siguiente"
          @click="nextSlide"
        >
          ›
        </button>

     

        <div class="mt-4 flex items-center justify-center gap-2">
          <button
            v-for="n in totalPages"
            :key="n"
            type="button"
            class="dot"
            :class="{ 'dot-active': n - 1 === currentPage }"
            :aria-label="`Ir al slide ${n}`"
            @click="goToPage(n - 1)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { databancos } from '../../domain/data/bancos'

const AUTOPLAY_DELAY = 3000
const DRAG_THRESHOLD = 40

const { t } = useI18n()

const currentPage = ref(0)
const slidesPerView = ref(5)
const progress = ref(0)

const pointerStartX = ref(0)
const dragging = ref(false)
const wheelLocked = ref(false)

let autoplayTimer: ReturnType<typeof setInterval> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null
let autoplayStart = Date.now()
let wheelUnlockTimer: ReturnType<typeof setTimeout> | null = null

const totalPages = computed(() => {
  const pages = databancos.length - slidesPerView.value + 1
  return Math.max(pages, 1)
})

const translateX = computed(() => (currentPage.value * 100) / slidesPerView.value)

const setSlidesPerView = () => {
  const width = window.innerWidth
  if (width < 575) slidesPerView.value = 2
  else if (width < 767) slidesPerView.value = 3
  else if (width < 1199) slidesPerView.value = 4
  else slidesPerView.value = 5

  if (currentPage.value > totalPages.value - 1) {
    currentPage.value = totalPages.value - 1
  }
}

const resetClock = () => {
  autoplayStart = Date.now()
  progress.value = 0
}

const nextSlide = () => {
  if (totalPages.value <= 1) return
  currentPage.value = (currentPage.value + 1) % totalPages.value
  resetClock()
}

const prevSlide = () => {
  if (totalPages.value <= 1) return
  currentPage.value = (currentPage.value - 1 + totalPages.value) % totalPages.value
  resetClock()
}

const goToPage = (page: number) => {
  currentPage.value = page
  resetClock()
}

const startAutoplay = () => {
  pauseAutoplay()
  resetClock()
  autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY)
  progressTimer = setInterval(() => {
    const elapsed = Date.now() - autoplayStart
    progress.value = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100)
  }, 60)
}

const pauseAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

const onPointerDown = (event: PointerEvent) => {
  dragging.value = true
  pointerStartX.value = event.clientX
}

const onPointerUp = (event: PointerEvent) => {
  if (!dragging.value) return
  const delta = event.clientX - pointerStartX.value
  if (Math.abs(delta) > DRAG_THRESHOLD) {
    if (delta < 0) nextSlide()
    else prevSlide()
  }
  dragging.value = false
}

const onPointerCancel = () => {
  dragging.value = false
}

const onWheel = (event: WheelEvent) => {
  if (wheelLocked.value) return
  if (Math.abs(event.deltaY) < 10 && Math.abs(event.deltaX) < 10) return

  wheelLocked.value = true
  if (event.deltaY > 0 || event.deltaX > 0) nextSlide()
  else prevSlide()

  if (wheelUnlockTimer) clearTimeout(wheelUnlockTimer)
  wheelUnlockTimer = setTimeout(() => {
    wheelLocked.value = false
  }, 300)
}

onMounted(() => {
  setSlidesPerView()
  startAutoplay()
  window.addEventListener('resize', setSlidesPerView)
})

onBeforeUnmount(() => {
  pauseAutoplay()
  if (wheelUnlockTimer) clearTimeout(wheelUnlockTimer)
  window.removeEventListener('resize', setSlidesPerView)
})
</script>

<style scoped>
.slider-viewport {
  overflow: hidden;
  width: 100%;
  user-select: none;
  touch-action: pan-y;
}

.slider-track {
  display: flex;
  gap: 0;
  transition: transform 360ms ease;
}

.slider-slide {
  flex: 0 0 calc(100% / var(--slides-per-view));
  padding: 0.75rem 0.5rem;
}

.nav-btn {
  position: absolute;
  top: 40%;
  z-index: 10;
  height: 2.25rem;
  width: 2.25rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.nav-btn-left {
  left: -0.5rem;
}

.nav-btn-right {
  right: -0.5rem;
}

.dot {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background: #d1d5db;
  transition: all 150ms ease;
}

.dot-active {
  width: 1rem;
  background: #153e80;
}

@media (max-width: 767px) {
  .nav-btn {
    display: none;
  }
}
</style>
