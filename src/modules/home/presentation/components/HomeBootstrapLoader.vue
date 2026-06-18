<script setup lang="ts">
defineProps<{ visible: boolean }>()
</script>
<template>
  <Transition name="loader-fade">
    <div v-if="visible" class="fixed inset-0 z-[1000] grid place-items-center bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white" role="status" aria-live="polite" aria-label="Cargando tasas, comisiones y promociones">
      <div class="text-center"><img src="/assets/images/logo/logo-80.png" alt="" class="mx-auto h-20 w-20 rounded-2xl bg-white p-2 shadow-xl" /><p class="mt-5 text-xl font-bold tracking-tight">Preparando tu mejor tasa</p><div class="mx-auto mt-4 h-1.5 w-52 overflow-hidden rounded-full bg-white/25"><span class="loader-bar block h-full rounded-full bg-white" /></div></div>
    </div>
  </Transition>
</template>
<style scoped>
.loader-fade-enter-active,.loader-fade-leave-active{transition:opacity .2s ease}.loader-fade-enter-from,.loader-fade-leave-to{opacity:0}.loader-bar{width:45%;animation:loader-slide 1s ease-in-out infinite}@keyframes loader-slide{0%{transform:translateX(-110%)}100%{transform:translateX(330%)}}@media(prefers-reduced-motion:reduce){.loader-bar{animation:none;width:100%}.loader-fade-enter-active,.loader-fade-leave-active{transition:none}}
</style>
