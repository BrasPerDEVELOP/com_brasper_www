import type { Blog, BlogPage } from '../../domain/models'

export interface BlogRepository {
  getBlogs(params: { page: number; pageSize: number }): Promise<BlogPage>
  getBlogBySlug(slug: string): Promise<Blog | null>
}
