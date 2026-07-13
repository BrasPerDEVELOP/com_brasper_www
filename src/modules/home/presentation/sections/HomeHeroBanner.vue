<template>
  <section id="banner" class="relative overflow-hidden text-slate-800">
    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-[#e8f2ff] via-[#edf4ff] to-[#dce9ff]" />
    <div class="absolute inset-0 -z-10">
      <div class="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-blue-300/25 blur-3xl" />
      <div class="absolute right-0 top-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
      <div class="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />
    </div>

    <div
      class="relative z-10 mx-auto flex max-w-7xl flex-col items-stretch justify-center gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:gap-10 lg:gap-14 lg:px-12 lg:py-16"
    >
      <div class="order-2 flex min-w-0 w-full flex-1 flex-col items-center text-center md:order-1">
        <div class="flex items-center justify-center gap-4">
          <img
            src="/assets/flags/peru.svg"
            :alt="t('landing_section_peru')"
            width="56"
            height="56"
            class="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
          />
          <img
            src="/assets/flags/banderabrasil.png"
            :alt="t('landing_section_brazil')"
            width="56"
            height="56"
            class="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
          />
        </div>

        <div class="relative mx-auto mt-5 w-full max-w-[465px] pl-11 sm:pl-12">
          <span class="absolute left-0 top-1 flex h-10 w-10 items-center justify-center text-[#25D366]" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="h-7 w-7 fill-current sm:h-8 sm:w-8" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </span>
          <h1 class="text-center text-3xl font-extrabold leading-tight text-secondary sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {{ t('landing_title') }}
          </h1>
        </div>

        <p class="mx-auto mt-3 max-w-[465px] text-center text-lg font-semibold leading-relaxed text-secondary sm:text-xl">
          {{ t('landing_description') }}
        </p>

        <div class="mt-6 flex w-full flex-wrap items-center justify-center gap-4">
          <div class="aspect-[760/366] w-full max-w-[560px] overflow-hidden">
            <img
              :src="displayedBannerImageSrc"
              :srcset="displayedBannerSrcset"
              :alt="t('landing_badge')"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              width="760"
              height="366"
              sizes="(max-width: 768px) 100vw, 560px"
              class="h-full w-full object-contain"
              @error="onDisplayedBannerImageError"
            />
          </div>
        </div>
      </div>

      <div class="order-1 flex w-full justify-center md:order-2 md:block md:w-lg md:justify-normal">
        <div class="relative w-full max-w-[500px] min-w-[min(100%,280px)] md:max-w-none">
          <div class="absolute -inset-4 -z-10 rounded-[30px] bg-black/10 blur-2xl" />
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
            custom-classes="!mx-auto !w-full !max-w-[500px] !rounded-[24px] !border !border-white/70 !bg-white !p-6 !shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:!p-8"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
