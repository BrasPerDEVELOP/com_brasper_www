<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <Navbar />
    <FaqSection />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/interface/layout/Navbar.vue'
import Footer from '@/interface/layout/Footer.vue'
import FaqSection from '../widgets/FaqSection.vue'
</script>
