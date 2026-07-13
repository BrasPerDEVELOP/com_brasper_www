<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-800">
    <Navbar />

    <main class="flex flex-1 items-center justify-center px-4 py-20">
      <section class="mx-auto max-w-xl text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Error 404</p>
        <h1 class="mt-4 text-4xl font-extrabold leading-tight text-secondary sm:text-5xl">
          {{ copy.title }}
        </h1>
        <p class="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-600">
          {{ copy.description }}
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <router-link
            :to="{ name: 'homepage', params: { locale: routeLocale } }"
            class="inline-flex items-center justify-center rounded-xl bg-primary-tailwind px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-95"
          >
            {{ copy.home }}
          </router-link>
          <router-link
            :to="{ name: 'blog-list', params: { locale: routeLocale } }"
            class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
          >
            {{ copy.blog }}
          </router-link>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navbar from '@/interface/layout/Navbar.vue'
import Footer from '@/interface/layout/Footer.vue'
import { useSeo } from '@/interface/presentation/composables/useSeo'
import { normalizeRouteLocale } from '@/interface/presentation/i18n/locales'

const route = useRoute()
const { locale } = useI18n()

const routeLocale = computed(() => normalizeRouteLocale(route.params.locale))

const copy = computed(() => {
  if (locale.value === 'en') {
    return {
      title: 'Page not found',
      description: 'The page you are looking for does not exist or has been moved.',
      home: 'Back to home',
      blog: 'Read the blog'
    }
  }
  if (locale.value === 'pt') {
    return {
      title: 'Página não encontrada',
      description: 'A página que você procura não existe ou foi movida.',
      home: 'Voltar ao início',
      blog: 'Ler o blog'
    }
  }
  return {
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o fue movida.',
    home: 'Volver al inicio',
    blog: 'Leer el blog'
  }
})

// Página de error: nunca debe indexarse.
useSeo(
  computed(() => ({
    title: `${copy.value.title} | Brasper`,
    description: copy.value.description,
    robots: 'noindex,follow'
  }))
)
</script>
