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
        class="max-w-xs rounded-full bg-azure-600 px-4 py-2 text-sm font-medium text-white shadow-lg"
      >
        {{ currentText }}
      </div>
    </Transition>
  </div>

  <a
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="group fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] p-3 text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-[0_14px_35px_rgba(0,0,0,0.32)] sm:right-5 sm:px-4 lg:bottom-8 lg:right-8"
    :aria-label="whatsappLabel"
  >
    <Icon icon="ic:round-whatsapp" class="h-8 w-8 shrink-0" aria-hidden="true" />
    <span class="hidden pr-1 text-sm font-bold sm:block">{{ whatsappLabel }}</span>
  </a>
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

const whatsappData: Record<SupportedLocale, { label: string; message: string }> = {
  es: {
    label: 'Atención por WhatsApp',
    message: 'Hola, necesito atención para realizar una transferencia.'
  },
  en: {
    label: 'WhatsApp support',
    message: 'Hello, I need assistance with a transfer.'
  },
  pt: {
    label: 'Atendimento pelo WhatsApp',
    message: 'Olá, preciso de atendimento para realizar uma transferência.'
  }
}

const WHATSAPP_PHONE_NUMBER = '51966991933'

const socialLinks = [
  {
    href: 'https://www.instagram.com/reel/DJZgOHdOAKk/?igsh=aHMwOW1jZmtvd2sw',
    label: 'Instagram',
    icon: 'mdi:instagram',
    iconClass: 'text-azure-600'
  },
  {
    href: 'https://www.facebook.com/share/r/1ARL1Z9f3G/',
    label: 'Facebook',
    icon: 'mdi:facebook',
    iconClass: 'text-azure-700'
  }
] as const

const { locale } = useI18n()
const currentIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const currentLocale = computed<SupportedLocale>(() => {
  const value = locale.value
  return value === 'es' || value === 'en' || value === 'pt' ? value : 'es'
})

const whatsappLabel = computed(() => whatsappData[currentLocale.value].label)
const whatsappUrl = computed(() => {
  const message = encodeURIComponent(whatsappData[currentLocale.value].message)
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${message}`
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
