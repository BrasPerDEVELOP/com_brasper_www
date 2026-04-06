<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <Navbar />

    <HomeHeroBanner />

    <BancosSlider />

    <ScheduleTransferForm />

<!--     <LandingAttentionSection /> -->

<!--     <LandingImpactSection /> -->

    <LandingAboutContactSection />

    <GetInformedSlider />

    <LandingPartnersSection />

    <LandingBestRatesSection />

    <LandingAboutAdvantagesSection />

    <LandingHowItWorksSection />

    <SocialHelpWidget />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Navbar from '@/interface/layout/Navbar.vue'
import Footer from '@/interface/layout/Footer.vue'
import BancosSlider from '../widgets/BancosSlider.vue'
import ScheduleTransferForm from '../widgets/ScheduleTransferForm.vue'
import SocialHelpWidget from '../widgets/SocialHelpWidget.vue'
import HomeHeroBanner from '../sections/HomeHeroBanner.vue'
/* import LandingAttentionSection from '../sections/LandingAttentionSection.vue' */

const GetInformedSlider = defineAsyncComponent(() => import('../widgets/GetInformedSlider.vue'))
/* const LandingImpactSection = defineAsyncComponent(() => import('../sections/LandingImpactSection.vue')) */
const LandingAboutContactSection = defineAsyncComponent(() => import('../sections/LandingAboutContactSection.vue'))
const LandingPartnersSection = defineAsyncComponent(() => import('../sections/LandingPartnersSection.vue'))
const LandingBestRatesSection = defineAsyncComponent(() => import('../sections/LandingBestRatesSection.vue'))
const LandingAboutAdvantagesSection = defineAsyncComponent(() => import('../sections/LandingAboutAdvantagesSection.vue'))
const LandingHowItWorksSection = defineAsyncComponent(() => import('../sections/LandingHowItWorksSection.vue'))
</script>
