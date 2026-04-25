<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <Navbar />

    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <router-link
        :to="{ name: 'blog-list' }"
        class="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        {{ t('blog_back_to_list') }}
      </router-link>

      <!-- Loading: skeleton (artículo + sidebar) -->
      <div v-if="blogStore.isLoadingDetail" class="mt-6 lg:grid lg:grid-cols-12 lg:gap-10">
        <div class="lg:col-span-8">
          <div
            class="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900 p-6 md:p-8"
          >
            <div class="grid gap-6 md:grid-cols-2 md:items-center">
              <div class="aspect-video w-full animate-pulse rounded-xl bg-white/10" />
              <div class="space-y-4">
                <div class="h-4 w-24 animate-pulse rounded-full bg-white/20" />
                <div class="h-8 w-full animate-pulse rounded-lg bg-white/20 md:h-10" />
                <div class="h-4 w-3/4 animate-pulse rounded bg-white/15" />
                <div class="h-10 w-40 animate-pulse rounded-lg bg-white/20" />
              </div>
            </div>
          </div>
          <div class="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div class="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div class="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
            <div class="h-32 w-full animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <aside class="mt-10 lg:col-span-4 lg:mt-0">
          <div class="mb-4 h-7 w-48 animate-pulse rounded bg-slate-200" />
          <div v-for="n in 3" :key="`sk-${n}`" class="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="mb-3 h-28 w-full animate-pulse rounded-lg bg-slate-200" />
            <div class="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div class="mt-2 h-5 w-full animate-pulse rounded bg-slate-200" />
            <div class="mt-2 h-4 w-full animate-pulse rounded bg-slate-100" />
            <div class="mt-4 flex justify-between">
              <div class="h-3 w-16 animate-pulse rounded bg-slate-100" />
              <div class="h-3 w-14 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </aside>
      </div>

      <p v-else-if="blogStore.error" class="mt-6 text-sm text-red-600">
        {{ blogStore.error }}
      </p>

      <div v-else-if="blog" class="mt-6 lg:grid lg:grid-cols-12 lg:gap-10">
        <!-- Columna principal -->
        <div class="lg:col-span-8">
          <!-- Hero (similar referencia: imagen + título sobre gradiente) -->
          <div
            class="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 shadow-lg"
          >
            <div class="grid gap-6 p-6 md:grid-cols-2 md:items-center md:p-8 lg:gap-8">
              <div class="aspect-video w-full overflow-hidden rounded-xl bg-black/20">
                <img
                  v-if="blog.public_id"
                  :src="getCloudinaryImage(blog.public_id)"
                  :alt="blog.title"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full min-h-[160px] items-center justify-center text-sm text-white/70"
                >
                  {{ t('blog_image_unavailable') }}
                </div>
              </div>
              <div class="flex flex-col justify-center text-white">
                <span
                  class="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200"
                >
                  {{ blog.category }}
                </span>
                <h1 class="mt-3 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                  {{ blog.title }}
                </h1>
                <p class="mt-3 text-sm text-white/80 md:text-base">
                  <span class="italic">{{ t('blog_author_brasper') }}</span>
                  <span class="mx-2">·</span>
                  <span>{{ formatDate(blog.date || blog.created_at) }}</span>
                </p>
                <p class="mt-2 text-sm text-cyan-100/90">
                  {{ t('blog_reading_time', { time: blog.read_time || '—' }) }}
                </p>
                <button
                  type="button"
                  class="mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow transition hover:bg-amber-400"
                  @click="scrollToArticleBody"
                >
                  {{ t('blog_read_article') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Cuerpo -->
          <article
            id="article-body"
            class="mt-6 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10"
          >
            <p class="text-base leading-relaxed text-slate-600">
              {{ blog.excerpt }}
            </p>
            <div class="prose prose-slate mt-8 max-w-none prose-headings:text-slate-900" v-html="blog.content" />
          </article>
        </div>

        <!-- Sidebar: publicaciones recientes -->
        <aside class="mt-10 lg:col-span-4 lg:mt-0">
          <h2 class="mb-5 text-lg font-bold text-slate-900 md:text-xl">
            <span>{{ t('blog_recent_posts_prefix') }}</span>
            <span class="text-primary">{{ t('blog_recent_posts_highlight') }}</span>
          </h2>

          <div v-if="blogStore.isLoading && recommendedPosts.length === 0" class="space-y-4">
            <div v-for="n in 3" :key="`side-sk-${n}`" class="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
              <div class="mb-3 h-24 rounded-lg bg-slate-200" />
              <div class="h-4 w-3/4 rounded bg-slate-200" />
            </div>
          </div>

          <template v-else-if="recommendedPosts.length > 0">
            <article
              v-for="item in recommendedPosts"
              :key="item.id"
              class="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <router-link
                :to="{ name: 'blog-detail', params: { slug: item.slug } }"
                class="block"
              >
                <div class="h-32 w-full bg-slate-100">
                  <img
                    v-if="item.public_id"
                    :src="getCloudinaryImage(item.public_id)"
                    :alt="item.title"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="flex h-full items-center justify-center text-xs text-slate-400"
                  >
                    {{ t('blog_image_unavailable') }}
                  </div>
                </div>
                <div class="p-4">
                  <span
                    class="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase text-amber-800"
                  >
                    {{ item.category }}
                  </span>
                  <h3 class="mt-2 line-clamp-2 text-base font-bold text-slate-900">
                    {{ item.title }}
                  </h3>
                  <p class="mt-2 line-clamp-2 text-sm text-slate-600">
                    {{ item.excerpt }}
                  </p>
                  <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{{ formatDate(item.date || item.created_at) }}</span>
                    <span>{{ t('blog_author_brasper') }}</span>
                  </div>
                  <span class="mt-2 inline-block text-sm font-semibold text-indigo-600">
                    {{ t('blog_read_more') }} →
                  </span>
                </div>
              </router-link>
            </article>
          </template>

          <p v-else class="text-sm text-slate-500">
            {{ t('blog_no_recommended') }}
          </p>
        </aside>
      </div>

      <p v-else class="mt-6 text-slate-600">
        {{ t('blog_not_found') }}
      </p>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navbar from '@/interface/layout/Navbar.vue'
import Footer from '@/interface/layout/Footer.vue'
import { useSeo } from '@/interface/presentation/composables/useSeo'
import { useBlogStore } from '../controllers/useBlogStore'
import type { Blog } from '../../domain/models'

const route = useRoute()
const blogStore = useBlogStore()
const { t, locale } = useI18n()

const blog = computed(() => blogStore.activeBlog)

const currentSlug = computed(() => String(route.params.slug ?? ''))

const recommendedPosts = computed((): Blog[] => {
  const s = currentSlug.value
  return blogStore.blogs.filter((b) => b.slug !== s).slice(0, 4)
})

function getCloudinaryImage(publicId: string): string {
  return `https://res.cloudinary.com/dhkmdutec/image/upload/f_auto,q_auto,w_1200/${publicId}`
}

const seoTitle = computed(() => {
  const activeBlog = blog.value
  return activeBlog?.title ? `${activeBlog.title} | Brasper` : t('seo_blog_detail_title')
})

const seoDescription = computed(() => {
  const activeBlog = blog.value
  return activeBlog?.excerpt || t('seo_blog_detail_description')
})

const seoImage = computed(() => {
  const activeBlog = blog.value
  return activeBlog?.public_id ? getCloudinaryImage(activeBlog.public_id) : '/assets/images/logo/logo_completo.png'
})

useSeo(
  computed(() => ({
    title: seoTitle.value,
    description: seoDescription.value,
    image: seoImage.value,
    type: 'article'
  }))
)

function formatDate(dateValue: string): string {
  if (!dateValue) return t('blog_no_date')
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return t('blog_no_date')
  const loc =
    locale.value === 'en' ? 'en-US' : locale.value === 'pt' ? 'pt-BR' : 'es-PE'
  return date.toLocaleDateString(loc, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function scrollToArticleBody() {
  document.getElementById('article-body')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function loadPage(slug: string) {
  if (!slug) return
  await Promise.all([blogStore.loadBlogBySlug(slug), blogStore.loadBlogs(1)])
}

onMounted(() => {
  void loadPage(currentSlug.value)
})

watch(
  () => route.params.slug,
  (newSlug) => {
    const s = String(newSlug ?? '')
    if (s) void loadPage(s)
  }
)
</script>
