import type { Blog, BlogPage } from '../../domain/models'

export interface BlogListParams {
  page: number
  pageSize: number
  search?: string
  category?: string
  enable?: boolean
}

export interface BlogRepository {
  getBlogs(params: BlogListParams): Promise<BlogPage>
  getBlogBySlug(slug: string): Promise<Blog | null>
}
