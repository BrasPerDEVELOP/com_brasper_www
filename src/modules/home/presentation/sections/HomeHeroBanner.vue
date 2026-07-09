<template>
  <section id="banner" class="relative overflow-hidden bg-gradient-to-br from-azure-700 via-azure-600 to-azure-500 text-white md:bg-gradient-to-r md:from-azure-600 md:to-azure-400">
    <div class="absolute inset-0 -z-10">
      <div class="absolute left-1/2 top-0 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-300/30 blur-3xl md:h-[520px] md:w-[720px] md:bg-cyan-300/40" />
      <div class="absolute right-0 top-20 h-56 w-56 rounded-full bg-azure-300/25 blur-3xl md:top-28 md:h-80 md:w-80 md:bg-azure-300/30" />
      <div class="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl md:left-0 md:top-64 md:h-80 md:w-80 md:bg-cyan-200/40" />
    </div>

    <div class="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-4 pt-4 pb-6 sm:px-6 sm:pt-5 md:flex-row md:items-start md:gap-6 md:py-12 lg:gap-12 lg:px-12 lg:py-20">
      <div class="min-w-0 w-full flex-1 text-center md:text-left">
        <div class="hidden items-center gap-2 font-bold md:flex">
          <Icon icon="ic:round-whatsapp" width="32" height="32" class="shrink-0" />
          <span class="inline-flex rounded-full px-3 py-1.5 text-xs uppercase tracking-widest text-white">
            <p class="text-cyan-300">{{ t('landing_badge_title') }}</p>
            {{ t('landing_badge') }}
          </span>
        </div>

        <h1 class="mx-auto max-w-[22rem] px-1 text-[1.35rem] font-bold leading-[1.35] tracking-tight sm:max-w-md sm:text-2xl sm:leading-tight md:mx-0 md:max-w-none md:px-0 md:text-xl md:leading-snug lg:text-3xl xl:text-4xl">
          {{ t('landing_title') }}
        </h1>

        <div class="mt-4 hidden flex-wrap items-center justify-center gap-4 md:flex lg:justify-center">
          <div class="aspect-[760/366] w-full overflow-hidden">
            <img
              :src="displayedBannerImageSrc"
              :alt="t('landing_badge')"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              width="760"
              height="366"
              sizes="(max-width: 768px) 100vw, 380px"
              class="h-full w-full object-cover"
              @error="onDisplayedBannerImageError"
            />
          </div>
        </div>
      </div>

      <div class="mx-auto w-full max-w-md md:max-w-none sm:w-lg">
        <div class="relative w-full min-w-0">
          <div class="absolute -inset-2 -z-10 rounded-3xl bg-white/25 blur-xl md:-inset-3 md:rounded-[30px] md:bg-gradient-to-r md:from-cyan-300/60 md:via-azure-300/40 md:to-cyan-300/60 md:blur-2xl" />
          <CalculatorView
            variant="banner"
            :initial-amount="300"
            :show-button="true"
            :show-terms="true"
            :show-reductions="true"
            :button-text="t('send_money')"
            :title="t('calculatorTitle')"
            :subtitle="t('calculator_description')"
            custom-classes="!max-w-full !rounded-2xl !border !border-white/60 !p-4 !shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] sm:!rounded-[28px] sm:!p-6 md:!rounded-[30px] md:!border-0 md:!p-8 md:!shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { apiClient } from '@/interface/api/client'
import { env } from '@/interface/config/env'
import { Domain } from '@/interface/infrastructure/services'
import CalculatorView from '@/modules/calculator/presentation/bodies/CalculatorView.vue'

const HOME_BANNER_LIST_PATH = '/home-banner/home-image/'
const HOME_BANNER_STORAGE_KEY = 'brasper.homeBanner'

type HomeBannerApiRow = {
  id: string
  banner_es: string
  banner_pr: string
  banner_en: string
  enable: boolean
  updated_at?: string
}

const { t, locale } = useI18n()
const remoteBanner = shallowRef<HomeBannerApiRow | null>(readCachedHomeBanner())
const displayedBannerImageSrc = shallowRef(localBannerSrc())

function withStableVersion(url: string, version?: string): string {
  if (!url || !version) return url
  return `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(version)}`
}

function localBannerSrc(): string {
  const file = locale.value === 'es' ? 'es' : locale.value === 'en' ? 'en' : 'pr'
  return `/assets/images/banner/${file}.webp`
}

function readCachedHomeBanner(): HomeBannerApiRow | null {
  if (typeof localStorage === 'undefined') return null
  try {
    return parseHomeBannerRow(JSON.parse(localStorage.getItem(HOME_BANNER_STORAGE_KEY) ?? 'null'))
  } catch {
    return null
  }
}

function cacheHomeBanner(row: HomeBannerApiRow): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(HOME_BANNER_STORAGE_KEY, JSON.stringify(row))
  } catch {
    // El banner local permanece como respaldo si el almacenamiento no está disponible.
  }
}

function parseHomeBannerRow(item: unknown): HomeBannerApiRow | null {
  if (item == null || typeof item !== 'object') return null
  const value = item as Record<string, unknown>
  const id = value.id != null ? String(value.id) : ''
  if (!id) return null
  return {
    id,
    banner_es: typeof value.banner_es === 'string' ? value.banner_es : '',
    banner_pr: typeof value.banner_pr === 'string' ? value.banner_pr : '',
    banner_en: typeof value.banner_en === 'string' ? value.banner_en : '',
    enable: value.enable !== false && value.enable !== 0,
    updated_at: typeof value.updated_at === 'string' ? value.updated_at : undefined
  }
}

function homeBannerDetailPath(id: string): string {
  return `${HOME_BANNER_LIST_PATH}${encodeURIComponent(id.trim())}/`
}

async function fetchHomeBanner(): Promise<void> {
  try {
    const fixedId = env.homeBannerId.trim()
    if (fixedId) {
      const { data } = await apiClient.get<unknown>(homeBannerDetailPath(fixedId))
      const row = parseHomeBannerRow(data)
      if (row) {
        remoteBanner.value = row
        cacheHomeBanner(row)
      }
      return
    }

    const { data } = await apiClient.get<unknown>(HOME_BANNER_LIST_PATH)
    if (!Array.isArray(data) || data.length === 0) return
    const rows = data.map(parseHomeBannerRow).filter((row): row is HomeBannerApiRow => row != null)
    const active = rows.find((row) => row.enable) ?? rows[0] ?? null
    if (active) {
      remoteBanner.value = active
      cacheHomeBanner(active)
    }
  } catch {
    if (!remoteBanner.value) remoteBanner.value = null
  }
}

const bannerImageSrc = computed(() => {
  const row = remoteBanner.value
  if (row?.enable) {
    const path = locale.value === 'es' ? row.banner_es : locale.value === 'en' ? row.banner_en : row.banner_pr
    const url = path ? Domain.mediaUrl(path) : ''
    if (url) return withStableVersion(url, row.updated_at)
  }
  return localBannerSrc()
})

function onDisplayedBannerImageError(): void {
  displayedBannerImageSrc.value = localBannerSrc()
}

watch(bannerImageSrc, (nextSrc, _previousSrc, onCleanup) => {
  if (!nextSrc || nextSrc === displayedBannerImageSrc.value) return

  const fallbackSrc = localBannerSrc()
  let cancelled = false
  const image = new Image()
  image.onload = () => {
    if (!cancelled) displayedBannerImageSrc.value = nextSrc
  }
  image.onerror = () => {
    if (!cancelled) displayedBannerImageSrc.value = fallbackSrc
  }
  image.src = nextSrc

  onCleanup(() => {
    cancelled = true
    image.onload = null
    image.onerror = null
  })
}, { immediate: true })

onMounted(() => { void fetchHomeBanner() })
</script>
