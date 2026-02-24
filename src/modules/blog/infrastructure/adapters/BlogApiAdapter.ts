import { apiClient } from '@/interface/api/client'
import type { BlogRepository } from './BlogRepository'
import type { Blog, BlogPage } from '../../domain/models'

const BLOG_API_BASE_URL = 'https://pro.brasper.site/api/v1'

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim()
}

function toSafeString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function calculateReadTime(content: string): string {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min lectura`
}

function parseBlog(item: Record<string, unknown>): Blog {
  const content = toSafeString(item.content)
  const excerptRaw = toSafeString(item.excerpt)
  const createdAt = toSafeString(item.created_at)

  return {
    id: String(item.id ?? ''),
    slug: toSafeString(item.slug),
    title: toSafeString(item.title),
    excerpt: excerptRaw || stripHtml(content).slice(0, 180),
    content,
    category: toSafeString(item.category) || 'General',
    public_id: toSafeString(item.public_id),
    created_at: createdAt,
    updated_at: toSafeString(item.updated_at),
    date: createdAt,
    read_time: toSafeString(item.read_time) || calculateReadTime(content)
  }
}

function parseBlogList(data: unknown): BlogPage {
  if (data == null || typeof data !== 'object') {
    return { count: 0, next: null, previous: null, results: [] }
  }

  const payload = data as Record<string, unknown>
  const rawResults = Array.isArray(payload.results) ? payload.results : []

  return {
    count: Number(payload.count ?? 0) || 0,
    next: typeof payload.next === 'string' ? payload.next : null,
    previous: typeof payload.previous === 'string' ? payload.previous : null,
    results: rawResults
      .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
      .map(parseBlog)
      .filter((blog) => blog.id.length > 0)
  }
}

export class BlogApiAdapter implements BlogRepository {
  async getBlogs(params: { page: number; pageSize: number }): Promise<BlogPage> {
    const response = await apiClient.get<unknown>(`${BLOG_API_BASE_URL}/blogs/`, {
      params: {
        page: params.page,
        page_size: params.pageSize
      }
    })

    return parseBlogList(response.data)
  }

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const response = await apiClient.get<unknown>(`${BLOG_API_BASE_URL}/blogs/${slug}/`)
    if (response.data == null || typeof response.data !== 'object') return null
    return parseBlog(response.data as Record<string, unknown>)
  }
}
