<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <Navbar />
    <FaqSection />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/interface/layout/Navbar.vue'
import Footer from '@/interface/layout/Footer.vue'
import { useSeo } from '@/interface/presentation/composables/useSeo'
import { useJsonLd } from '@/interface/presentation/composables/useJsonLd'
import FaqSection from '../widgets/FaqSection.vue'

const { t } = useI18n()

useSeo(
  computed(() => ({
    title: t('seo_faq_title'),
    description: t('seo_faq_description')
  }))
)

// FAQPage: las preguntas/respuestas son visibles en la página (mismas claves que FaqSection).
const faqJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [1, 2, 3, 4].map((n) => ({
    '@type': 'Question',
    name: t(`landing_faq_${n}_question`),
    acceptedAnswer: {
      '@type': 'Answer',
      text: t(`landing_faq_${n}_answer`)
    }
  }))
}))

useJsonLd('faq', faqJsonLd)
</script>
