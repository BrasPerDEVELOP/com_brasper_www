import type { BlogPage } from '../../domain/models'
import type { BlogListParams, BlogRepository } from '../../infrastructure/adapters/BlogRepository'

export class GetBlogsUseCase {
  constructor(private readonly repository: BlogRepository) {}

  async execute(params: BlogListParams): Promise<BlogPage> {
    return this.repository.getBlogs(params)
  }
}
