<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <Navbar />

    <section class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <router-link
        :to="{ name: 'blog-list' }"
        class="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Volver al blog
      </router-link>

      <div v-if="blogStore.isLoadingDetail" class="mt-6 text-slate-600">
        Cargando blog...
      </div>

      <p v-else-if="blogStore.error" class="mt-6 text-sm text-red-600">
        {{ blogStore.error }}
      </p>

      <article v-else-if="blog" class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="h-72 w-full bg-slate-200 md:h-96">
          <img
            v-if="blog.public_id"
            :src="getCloudinaryImage(blog.public_id)"
            :alt="blog.title"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
            Imagen no disponible
          </div>
        </div>

        <div class="p-6 md:p-10">
          <span class="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            {{ blog.category }}
          </span>
          <h1 class="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
            {{ blog.title }}
          </h1>

          <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>{{ formatDate(blog.date || blog.created_at) }}</span>
            <span>•</span>
            <span>{{ blog.read_time }}</span>
          </div>

          <p class="mt-6 text-base leading-relaxed text-slate-600">
            {{ blog.excerpt }}
          </p>

          <div class="prose prose-slate mt-8 max-w-none" v-html="blog.content"></div>
        </div>
      </article>

      <p v-else class="mt-6 text-slate-600">
        No se encontró el artículo.
      </p>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/interface/layout/Navbar.vue'
import Footer from '@/interface/layout/Footer.vue'
import { useBlogStore } from '../controllers/useBlogStore'

const route = useRoute()
const blogStore = useBlogStore()

const blog = computed(() => blogStore.activeBlog)

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

onMounted(() => {
  const slug = String(route.params.slug ?? '')
  if (!slug) return
  blogStore.loadBlogBySlug(slug)
})
</script>
