<template>
  <section id="banner" class="relative overflow-hidden bg-gradient-to-br from-azure-700 via-azure-600 to-azure-500 text-white md:bg-gradient-to-r md:from-azure-600 md:to-azure-400">
    <div class="absolute inset-0 -z-10">
      <div class="absolute left-1/2 top-0 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-300/30 blur-3xl md:h-[520px] md:w-[720px] md:bg-cyan-300/40" />
      <div class="absolute right-0 top-20 h-56 w-56 rounded-full bg-azure-300/25 blur-3xl md:top-28 md:h-80 md:w-80 md:bg-azure-300/30" />
      <div class="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl md:left-0 md:top-64 md:h-80 md:w-80 md:bg-cyan-200/40" />
    </div>

    <div class="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-5 md:flex-row md:items-start md:gap-6 md:pt-12 lg:gap-12 lg:px-12 lg:pt-20">
      <div class="min-w-0 w-full flex-1 text-center md:text-left">
        <h1 class="mx-auto max-w-none px-0 text-[0.875rem] font-extrabold leading-[1.18] tracking-[-0.02em] !text-white sm:text-[1.1rem] md:mx-0 md:text-[1.2rem] lg:text-[1.5rem] xl:text-[1.8rem]">
          <span class="block whitespace-nowrap">
            <span class="!text-white">{{ t('hero_title_prefix') }}</span><span aria-hidden="true">&nbsp;</span>
            <span class="text-cyan-300">{{ t('hero_title_peru') }}</span>
            <span aria-hidden="true">&nbsp;</span><span class="!text-white">{{ t('hero_title_and') }}</span><span aria-hidden="true">&nbsp;</span>
            <span class="text-emerald-400">{{ t('hero_title_brazil') }}</span>
          </span>
          <span class="mt-1 block whitespace-nowrap !text-white">{{ t('hero_title_suffix') }}</span>
        </h1>

        <ul class="mt-5 grid grid-cols-3 items-start gap-2 md:mt-6 md:flex md:flex-wrap md:items-center md:justify-start md:gap-x-7 md:gap-y-3">
          <li v-for="chip in heroChips" :key="chip.title" class="flex flex-col items-center gap-2 text-center md:flex-row md:gap-2.5 md:text-left">
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/30 sm:h-11 sm:w-11"
              :class="chip.iconClass"
              aria-hidden="true"
            >
              <Icon :icon="chip.icon" width="22" height="22" />
            </span>
            <span class="text-xs font-semibold !text-white sm:text-sm md:text-base lg:text-lg">{{ t(chip.title) }}</span>
          </li>
        </ul>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-4 lg:justify-center">
          <div class="aspect-[760/366] w-full overflow-hidden rounded-2xl md:rounded-none">
            <img
              :src="displayedBannerImageSrc"
              :srcset="displayedBannerSrcset"
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

        <p class="mt-5 hidden items-center justify-center gap-3 text-center text-base font-bold tracking-wide text-white sm:text-lg md:mt-6 md:flex md:justify-start md:text-left md:text-xl">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-cyan-300 ring-1 ring-white/30" aria-hidden="true">
            <Icon icon="mdi:headset" width="22" height="22" />
          </span>
          <span>
            {{ t('hero_support_prefix') }}
            <span class="text-cyan-300">{{ t('hero_support_highlight') }}</span>
            {{ t('hero_support_suffix') }}
          </span>
        </p>
      </div>

      <div class="mx-auto w-full max-w-md md:max-w-none sm:w-lg">
        <div id="calculadora" class="relative w-full min-w-0 scroll-mt-24">
          <CalculatorView
            variant="banner"
            title-tag="h2"
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

    <div class="relative z-10 mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 md:pb-10 md:pt-8 lg:px-12 lg:pb-12">
      <div class="grid grid-cols-2 overflow-hidden rounded-2xl bg-blue-950/25 shadow-[0_12px_35px_rgba(0,54,180,0.16)] backdrop-blur-sm lg:grid-cols-4 lg:rounded-[18px] lg:border lg:border-white/85 lg:bg-azure-700/15">
        <div
          v-for="item in trustItems"
          :key="item.title"
          class="flex min-h-32 flex-col items-center justify-center gap-3 border-white/15 px-2 py-5 text-center [&:nth-child(-n+2)]:border-b [&:nth-child(odd)]:border-r lg:min-h-24 lg:flex-row lg:gap-4 lg:border-white/40 lg:px-4 lg:py-4 lg:text-left lg:[&:not(:last-child)]:border-r lg:[&:nth-child(-n+2)]:border-b-0"
        >
          <span class="flex h-12 w-12 shrink-0 items-center justify-center text-white lg:h-14 lg:w-14 lg:rounded-xl lg:bg-white lg:text-azure-600 lg:shadow-md" aria-hidden="true">
            <Icon :icon="item.icon" width="40" height="40" />
          </span>
          <p class="text-sm font-bold leading-tight !text-white sm:text-base lg:text-lg">
            {{ t(item.title) }}<br />{{ t(item.subtitle) }}
          </p>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-center gap-3 lg:hidden">
        <span class="h-px flex-1 bg-white/45" aria-hidden="true"></span>
        <span class="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-white sm:text-base">
          <Icon icon="mdi:shield-check" width="21" height="21" class="text-cyan-300" aria-hidden="true" />
          <span><span class="text-cyan-300">{{ t('hero_trust_tagline_highlight') }}</span> {{ t('hero_trust_tagline_rest') }}</span>
        </span>
        <span class="h-px flex-1 bg-white/45" aria-hidden="true"></span>
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

/** Diferenciadores junto al título: se leen antes que la calculadora. */
const heroChips = [
  { icon: 'ic:round-bolt', title: 'hero_chip_minutes', iconClass: 'bg-azure-500' },
  { icon: 'mdi:shield-check', title: 'hero_chip_secure', iconClass: 'bg-azure-500' },
  { icon: 'ic:round-whatsapp', title: 'hero_chip_whatsapp', iconClass: 'bg-[#25d366]' }
] as const

const trustItems = [
  { icon: 'mdi:account-group', title: 'hero_trust_volume_title', subtitle: 'hero_trust_volume_subtitle' },
  { icon: 'mdi:shield-check', title: 'hero_trust_secure_title', subtitle: 'hero_trust_secure_subtitle' },
  { icon: 'ic:round-whatsapp', title: 'hero_trust_bilingual_title', subtitle: 'hero_trust_bilingual_subtitle' },
  { icon: 'mdi:finance', title: 'hero_trust_rate_title', subtitle: 'hero_trust_rate_subtitle' }
] as const

const LOCAL_BANNER_WIDTHS = [480, 768, 1152] as const
const LOCAL_BANNER_PREFIX = '/assets/images/banner/'

const remoteBanner = shallowRef<HomeBannerApiRow | null>(readCachedHomeBanner())
const displayedBannerImageSrc = shallowRef(localBannerSrc())

/**
 * Solo el banner local tiene variantes responsive. Cuando se muestra el banner
 * remoto (URL absoluta del CMS) se omite `srcset` para que el navegador use `src`.
 */
const displayedBannerSrcset = computed(() =>
  displayedBannerImageSrc.value.startsWith(LOCAL_BANNER_PREFIX) ? localBannerSrcset() : ''
)

function withStableVersion(url: string, version?: string): string {
  if (!url || !version) return url
  return `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(version)}`
}

function localBannerBase(): string {
  const file = locale.value === 'es' ? 'es' : locale.value === 'en' ? 'en' : 'pr'
  return `${LOCAL_BANNER_PREFIX}${file}`
}

/** Variante base usada como `src` (fallback si el navegador no soporta srcset). */
function localBannerSrc(): string {
  return `${localBannerBase()}-768.webp`
}

/** Conjunto responsive: el navegador elige la variante según viewport/DPR. */
function localBannerSrcset(): string {
  const base = localBannerBase()
  return LOCAL_BANNER_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', ')
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
