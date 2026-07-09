<template>
  <section id="bancos-section" class="relative bg-gradient-to-b from-white to-slate-50 py-14">
    <div class="mx-auto max-w-7xl px-4 text-center">
      <span class="inline-block rounded-full bg-azure-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-azure-600">
        {{ t('landing_section_banks_title') }}
      </span>
      <h2 class="mt-3 mb-8 text-2xl font-bold text-slate-800 sm:text-3xl">
        {{ t('landing_section_banks_subtitle') }}
      </h2>

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
                class="bank-card"
                :title="banco.nombre"
              >
                <img
                  :src="banco.img1"
                  :alt="banco.nombre"
                  loading="lazy"
                  decoding="async"
                  class="bank-logo"
                />
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="nav-btn nav-btn-left"
          aria-label="Anterior"
          @click.stop="prevSlide"
        >
          <svg class="nav-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          class="nav-btn nav-btn-right"
          aria-label="Siguiente"
          @click.stop="nextSlide"
        >
          <svg class="nav-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div class="mt-6 flex items-center justify-center gap-2">
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

const pointerStartX = ref(0)
const dragging = ref(false)
const wheelLocked = ref(false)

let autoplayTimer: ReturnType<typeof setInterval> | null = null
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

const nextSlide = () => {
  if (totalPages.value <= 1) return
  currentPage.value = (currentPage.value + 1) % totalPages.value
}

const prevSlide = () => {
  if (totalPages.value <= 1) return
  currentPage.value = (currentPage.value - 1 + totalPages.value) % totalPages.value
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const startAutoplay = () => {
  pauseAutoplay()
  autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY)
}

const pauseAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
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
  padding: 0.5rem;
}

.bank-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6rem;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid #eef1f6;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}

.bank-card:hover {
  transform: translateY(-4px);
  border-color: #c7d7f5;
  box-shadow: 0 12px 24px -12px rgba(21, 62, 128, 0.35);
}

.bank-logo {
  max-height: 2.75rem;
  max-width: 80%;
  width: auto;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.6;
  transition: filter 200ms ease, opacity 200ms ease;
}

.bank-card:hover .bank-logo {
  filter: grayscale(0);
  opacity: 1;
}

.nav-btn {
  position: absolute;
  top: 50%;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 9999px;
  border: 1px solid #dbe3ee;
  background: rgba(255, 255, 255, 0.95);
  color: #165efc;
  box-shadow: 0 4px 12px -4px rgba(15, 23, 42, 0.25);
  cursor: pointer;
  transform: translateY(-50%);
  transition: background 150ms ease, color 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}

.nav-btn__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-btn:hover {
  background: #165efc;
  color: #ffffff;
  transform: translateY(-50%) scale(1.05);
}

.nav-btn-left {
  left: 0.25rem;
}

.nav-btn-right {
  right: 0.25rem;
}

@media (min-width: 768px) {
  .nav-btn-left {
    left: -1rem;
  }

  .nav-btn-right {
    right: -1rem;
  }
}

@media (max-width: 767px) {
  .nav-btn {
    height: 2.25rem;
    width: 2.25rem;
    background: #ffffff;
  }

  .nav-btn__icon {
    width: 1.125rem;
    height: 1.125rem;
  }
}
.dot {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background: #d1d5db;
  transition: all 150ms ease;
}

.dot-active {
  width: 1.25rem;
  background: #165efc;
}
</style>
