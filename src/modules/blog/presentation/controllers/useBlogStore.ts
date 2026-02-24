import { defineStore } from 'pinia'
import type { Blog } from '../../domain/models'
import type { BlogRepository } from '../../infrastructure/adapters/BlogRepository'
import { BlogApiAdapter } from '../../infrastructure/adapters'
import { GetBlogBySlugUseCase, GetBlogsUseCase } from '../../application/use_cases'

interface BlogState {
  blogs: Blog[]
  totalCount: number
  page: number
  pageSize: number
  searchTerm: string
  category: string
  isLoading: boolean
  error: string | null
  activeBlog: Blog | null
  isLoadingDetail: boolean
}

function getRepository(): BlogRepository {
  return new BlogApiAdapter()
}

export const useBlogStore = defineStore('blog', {
  state: (): BlogState => ({
    blogs: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    searchTerm: '',
    category: '',
    isLoading: false,
    error: null,
    activeBlog: null,
    isLoadingDetail: false
  }),

  getters: {
    categories(state): string[] {
      const values = state.blogs.map((blog) => blog.category).filter(Boolean)
      return [...new Set(values)]
    },

    filteredBlogs(state): Blog[] {
      return state.blogs.filter((blog) => {
        const byCategory = state.category === '' || blog.category === state.category
        const bySearch = blog.title.toLowerCase().includes(state.searchTerm.toLowerCase())
        return byCategory && bySearch
      })
    },

    totalPages(state): number {
      return Math.max(1, Math.ceil(state.totalCount / state.pageSize))
    },

    canPrev(state): boolean {
      return state.page > 1
    },

    canNext(state): boolean {
      return state.page < Math.max(1, Math.ceil(state.totalCount / state.pageSize))
    }
  },

  actions: {
    async loadBlogs(page?: number) {
      const targetPage = page ?? this.page
      this.isLoading = true
      this.error = null
      try {
        const repo = getRepository()
        const useCase = new GetBlogsUseCase(repo)
        const data = await useCase.execute({ page: targetPage, pageSize: this.pageSize })
        this.page = targetPage
        this.blogs = data.results
        this.totalCount = data.count
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Error al cargar blogs'
      } finally {
        this.isLoading = false
      }
    },

    async loadBlogBySlug(slug: string) {
      this.isLoadingDetail = true
      this.error = null
      try {
        const repo = getRepository()
        const useCase = new GetBlogBySlugUseCase(repo)
        this.activeBlog = await useCase.execute(slug)
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Error al cargar el blog'
        this.activeBlog = null
      } finally {
        this.isLoadingDetail = false
      }
    },

    setSearchTerm(value: string) {
      this.searchTerm = value
      this.page = 1
    },

    setCategory(value: string) {
      this.category = value
      this.page = 1
    }
  }
})
