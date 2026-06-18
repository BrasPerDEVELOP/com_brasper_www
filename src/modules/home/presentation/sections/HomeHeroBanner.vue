<script setup lang="ts">
import { computed, onMounted, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { Domain } from '@/interface/infrastructure/services'
import CalculatorView from '@/modules/calculator/presentation/bodies/CalculatorView.vue'
import TransferCorridorIllustration from '../components/TransferCorridorIllustration.vue'
import { useHomeBootstrap } from '../composables/useHomeBootstrap'
import type { HomeLocale } from '../../domain/models/HomeBootstrap'

const { t, locale } = useI18n()
const bootstrap = useHomeBootstrap()
const remoteImageFailed = shallowRef(false)
const config = computed(() => bootstrap.data.value?.banner ?? null)
const contentLocale = computed<HomeLocale>(() => locale.value === 'en' ? 'en' : locale.value === 'pt' ? 'pr' : 'es')
const localizedContent = computed(() => config.value?.content?.[contentLocale.value])
const imageSrc = computed(() => {
  if (remoteImageFailed.value || !config.value?.enable) return ''
  const path = contentLocale.value === 'es' ? config.value.banner_es : contentLocale.value === 'en' ? config.value.banner_en : config.value.banner_pr
  if (!path) return ''
  const url = Domain.mediaUrl(path)
  return config.value.updated_at ? `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(config.value.updated_at)}` : url
})
const displayedImage = shallowRef('')
const bannerColors = computed(() => {
  const appearance = config.value?.appearance
  return {
    type: appearance?.type === 'solid' ? 'solid' as const : 'gradient' as const,
    primary: validColor(appearance?.primary) ? appearance.primary : '#2563eb',
    secondary: validColor(appearance?.secondary) ? appearance.secondary : '#38bdf8'
  }
})
const sectionStyle = computed(() => {
  const colors = bannerColors.value
  return { background: colors.type === 'solid' ? colors.primary : `linear-gradient(110deg, ${colors.primary}, ${colors.secondary})` }
})
const corridorTone = computed<'light' | 'dark'>(() => {
  const colors = bannerColors.value
  const luminance = colors.type === 'solid'
    ? relativeLuminance(colors.primary)
    : (relativeLuminance(colors.primary) + relativeLuminance(colors.secondary)) / 2
  return luminance < 0.48 ? 'light' : 'dark'
})
const visibleIndicators = computed(() => config.value?.show_indicators ? (config.value.indicators ?? []).filter((item) => item.enabled).slice(0, 3) : [])

function validColor(value?: string): value is string { return Boolean(value && /^#[0-9a-f]{6}$/i.test(value)) }
function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}
function handleImageError() { remoteImageFailed.value = true; displayedImage.value = '' }
watch(imageSrc, (source) => {
  displayedImage.value = ''
  if (!source) return
  const image = new Image()
  image.onload = () => { displayedImage.value = source }
  image.onerror = handleImageError
  image.src = source
}, { immediate: true })
watch(locale, () => { remoteImageFailed.value = false })
onMounted(bootstrap.load)
</script>

<template>
  <section id="banner" class="relative min-h-[680px] overflow-hidden text-white md:min-h-[620px]" :style="sectionStyle">
    <div v-if="config?.appearance.blur" class="pointer-events-none absolute inset-0" aria-hidden="true"><div class="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" /><div class="absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-blue-900/25 blur-3xl" /></div>
    <div class="relative z-10 mx-auto flex max-w-7xl flex-col items-stretch gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start lg:gap-12 lg:px-12 lg:py-20">
      <div class="min-w-0 flex-1 text-center md:text-left">
        <div class="flex items-center justify-center gap-2 md:justify-start"><Icon icon="mdi:whatsapp" width="32" height="32" /><p class="text-xs font-bold uppercase tracking-[.18em] text-yellow-300">{{ localizedContent?.eyebrow || `${t('landing_badge_title')} ${t('landing_badge')}` }}</p></div>
        <h1 class="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{{ localizedContent?.title || t('landing_title') }}</h1>
        <p v-if="localizedContent?.subtitle" class="mt-4 max-w-2xl text-base leading-relaxed text-white/85">{{ localizedContent.subtitle }}</p>
        <div v-if="visibleIndicators.length" class="mt-6 grid gap-3 sm:grid-cols-3">
          <div v-for="item in visibleIndicators" :key="item.icon" class="flex min-h-16 items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left backdrop-blur-sm"><Icon :icon="item.icon" width="26" height="26" class="shrink-0" /><span class="text-sm font-semibold">{{ item.text[contentLocale] }}</span></div>
        </div>
        <div v-if="config?.show_image !== false" class="mt-6 w-full">
          <div v-if="displayedImage" class="aspect-[760/366] overflow-hidden rounded-3xl shadow-2xl shadow-blue-950/25">
            <img :src="displayedImage" :alt="localizedContent?.image_alt || t('landing_badge')" loading="eager" fetchpriority="high" decoding="async" width="760" height="366" class="h-full w-full object-cover" @error="handleImageError" />
          </div>
          <TransferCorridorIllustration v-else :tone="corridorTone" />
        </div>
      </div>
      <div class="mx-auto w-full sm:w-lg"><div class="relative w-full min-w-[min(100%,280px)]"><div class="absolute -inset-3 -z-10 rounded-[30px] bg-white/20 blur-2xl" /><CalculatorView variant="banner" :initial-amount="300" :show-button="true" :show-terms="true" :show-reductions="true" :button-text="t('send_money')" :title="t('calculatorTitle')" :subtitle="t('calculator_description')" custom-classes="!max-w-full !rounded-[30px] !p-6 sm:!p-8" /></div></div>
    </div>
  </section>
</template>
