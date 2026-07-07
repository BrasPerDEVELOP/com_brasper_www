<template>
  <section id="banner" class="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 text-white">
    <div class="absolute inset-0 -z-10">
      <div class="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-300/40 blur-3xl" />
      <div class="absolute right-0 top-28 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
      <div class="absolute left-0 top-64 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
    </div>

    <div class="relative z-10 mx-auto flex max-w-7xl flex-col items-stretch justify-center gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:gap-6 lg:gap-12 lg:px-12 lg:py-20">
      <div class="min-w-0 w-full flex-1 text-center md:text-left">
        <div class="flex items-center gap-2 font-bold">
          <Icon icon="ic:round-whatsapp" width="32" height="32" class="shrink-0" />
          <span class="inline-flex rounded-full px-3 py-1.5 text-xs uppercase tracking-widest text-white">
            <p class="text-yellow-400">{{ t('landing_badge_title') }}</p>
            {{ t('landing_badge') }}
          </span>
        </div>

        <h1 class="text-xl font-bold leading-snug sm:text-lg md:text-xl lg:text-3xl xl:text-4xl">
          {{ t('landing_title') }}
        </h1>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-4 lg:justify-center">
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

      <div class="mx-auto w-full sm:w-lg">
        <div class="relative w-full min-w-[min(100%,280px)]">
          <div class="absolute -inset-3 -z-10 rounded-[30px] bg-gradient-to-r from-cyan-300/60 via-blue-300/40 to-cyan-300/60 blur-2xl" />
          <CalculatorView
            variant="banner"
            :initial-amount="300"
            :show-button="true"
            :show-terms="true"
            :show-reductions="true"
            :button-text="t('send_money')"
            :title="t('calculatorTitle')"
            :subtitle="t('calculator_description')"
            custom-classes="!max-w-full !rounded-[30px] !p-6 sm:!p-8"
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
