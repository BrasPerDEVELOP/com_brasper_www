<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <Navbar />
    <FaqSection />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Navbar from '@/interface/layout/Navbar.vue'
import Footer from '@/interface/layout/Footer.vue'
import { useSeo } from '@/interface/presentation/composables/useSeo'
import FaqSection from '../widgets/FaqSection.vue'

const { t } = useI18n()

useSeo({
  title: t('seo_faq_title'),
  description: t('seo_faq_description')
})
</script>
