<template>
  <div class="fixed bottom-4 left-4 z-40 hidden items-center gap-3 md:flex lg:bottom-8 lg:left-8">
    <div class="flex items-center gap-2">
      <a
        v-for="item in socialLinks"
        :key="item.href"
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
        :aria-label="item.label"
      >
        <Icon :icon="item.icon" class="h-7 w-7" :class="item.iconClass" />
      </a>
    </div>

    <Transition name="social-help-fade" mode="out-in">
      <div
        :key="currentText"
        class="max-w-xs rounded-full bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-lg"
      >
        {{ currentText }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

type SupportedLocale = 'es' | 'en' | 'pt'

const textByLocale: Record<SupportedLocale, string[]> = {
  es: [
    '¿No sabes cómo hacer tu transferencia?',
    '¿Necesitas ayuda con tu donación?',
    'Mira nuestras redes para más info',
    'Escríbenos por Instagram o Facebook'
  ],
  en: [
    "Don't know how to make your transfer?",
    'Need help with your donation?',
    'Check our socials for more info',
    'Message us on Instagram or Facebook'
  ],
  pt: [
    'Não sabe como fazer sua transferência?',
    'Precisa de ajuda com a doação?',
    'Veja nossas redes sociais',
    'Fale conosco pelo Instagram ou Facebook'
  ]
}

const socialLinks = [
  {
    href: 'https://www.instagram.com/reel/DJZgOHdOAKk/?igsh=aHMwOW1jZmtvd2sw',
    label: 'Instagram',
    icon: 'mdi:instagram',
    iconClass: 'text-pink-600'
  },
  {
    href: 'https://www.facebook.com/share/r/1ARL1Z9f3G/',
    label: 'Facebook',
    icon: 'mdi:facebook',
    iconClass: 'text-blue-700'
  }
] as const

const { locale } = useI18n()
const currentIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const currentLocale = computed<SupportedLocale>(() => {
  const value = locale.value
  return value === 'es' || value === 'en' || value === 'pt' ? value : 'es'
})

const texts = computed(() => textByLocale[currentLocale.value])
const currentText = computed(() => texts.value[currentIndex.value] ?? texts.value[0] ?? '')

function startRotation() {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % texts.value.length
  }, 4000)
}

watch(texts, () => {
  currentIndex.value = 0
  startRotation()
})

onMounted(() => {
  startRotation()
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.social-help-fade-enter-active,
.social-help-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.social-help-fade-enter-from,
.social-help-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
