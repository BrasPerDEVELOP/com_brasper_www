<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <Navbar />

    <section class="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 px-6 py-12 text-white">
        <h1 class="text-3xl font-bold md:text-4xl">Últimos artículos</h1>
        <p class="mt-3 max-w-2xl text-sm text-white/90 md:text-base">
          Mantente informado sobre transferencias internacionales, cambios de moneda y consejos financieros.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-full px-3 py-1 text-sm transition-colors"
          :class="activeCategory === '' ? 'bg-slate-800 text-white' : 'bg-gray-200 hover:bg-gray-300 text-slate-700'"
          @click="selectCategory('')"
        >
          Todos
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="rounded-full px-3 py-1 text-sm transition-colors"
          :class="activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar artículo..."
        :value="searchTerm"
        class="mb-6 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        @input="onSearch"
      />

      <div v-if="blogStore.isLoading" class="mb-6 flex items-center gap-2 text-slate-600">
        <span class="relative flex h-3 w-3">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
          <span class="relative inline-flex h-3 w-3 rounded-full bg-indigo-500"></span>
        </span>
        <span class="font-medium">Cargando blogs...</span>
      </div>

      <p v-if="blogStore.error" class="mb-6 text-sm text-red-600">
        {{ blogStore.error }}
      </p>

      <template v-if="blogStore.isLoading">
        <div class="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="n in 6" :key="`blog-skeleton-${n}`" class="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div class="h-48 w-full animate-pulse bg-gray-200"></div>
            <div class="p-4">
              <div class="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              <div class="mt-4 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div class="mt-2 space-y-2">
                <div class="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                <div class="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <p v-if="filteredBlogs.length === 0" class="mt-10 text-gray-500">
          No se encontraron blogs.
        </p>

        <div v-else class="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="blog in filteredBlogs"
            :key="blog.id"
            class="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
          >
            <div class="h-48 w-full bg-slate-200">
              <img
                v-if="blog.public_id"
                :src="getCloudinaryImage(blog.public_id)"
                :alt="blog.title"
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
                Imagen no disponible
              </div>
            </div>
            <div class="p-4">
              <span class="text-sm font-semibold text-indigo-600">{{ blog.category }}</span>
              <h3 class="mt-4 line-clamp-2 text-lg font-bold text-slate-900">{{ blog.title }}</h3>
              <p class="mt-2 line-clamp-3 text-sm text-gray-600">{{ blog.excerpt }}</p>
              <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{{ formatDate(blog.date || blog.created_at) }}</span>
                <span>{{ blog.read_time }}</span>
              </div>
              <div class="mt-4 flex justify-end">
                <router-link
                  :to="{ name: 'blog-detail', params: { slug: blog.slug } }"
                  class="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors duration-300 hover:bg-indigo-700"
                >
                  Leer más
                  <span class="text-base">→</span>
                </router-link>
              </div>
            </div>
          </article>
        </div>

        <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm text-gray-600">
            Página {{ currentPage }} de {{ totalPages }}
          </div>
          <div class="inline-flex items-center gap-2">
            <button
              type="button"
              class="rounded-md border px-4 py-2 transition-colors"
              :class="canPrev ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'"
              :disabled="!canPrev"
              @click="goPrev"
            >
              Anterior
            </button>
            <button
              type="button"
              class="rounded-md border px-4 py-2 transition-colors"
              :class="canNext ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'"
              :disabled="!canNext"
              @click="goNext"
            >
              Siguiente
            </button>
          </div>
        </div>
      </template>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Navbar from '@/interface/layout/Navbar.vue'
import Footer from '@/interface/layout/Footer.vue'
import { useBlogStore } from '../controllers/useBlogStore'

const blogStore = useBlogStore()

const categories = computed(() => blogStore.categories)
const filteredBlogs = computed(() => blogStore.filteredBlogs)
const totalPages = computed(() => blogStore.totalPages)
const currentPage = computed(() => blogStore.page)
const canPrev = computed(() => blogStore.canPrev)
const canNext = computed(() => blogStore.canNext)
const searchTerm = computed(() => blogStore.searchTerm)
const activeCategory = computed(() => blogStore.category)

function getCloudinaryImage(publicId: string): string {
  return `https://res.cloudinary.com/dhkmdutec/image/upload/${publicId}`
}

function formatDate(dateValue: string): string {
  if (!dateValue) return 'Sin fecha'
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function onSearch(event: Event) {
  const target = event.target as HTMLInputElement
  blogStore.setSearchTerm(target.value)
}

function selectCategory(category: string) {
  blogStore.setCategory(category)
}

function goPrev() {
  if (!blogStore.canPrev) return
  blogStore.loadBlogs(blogStore.page - 1)
}

function goNext() {
  if (!blogStore.canNext) return
  blogStore.loadBlogs(blogStore.page + 1)
}

onMounted(() => {
  blogStore.loadBlogs(1)
})
</script>
