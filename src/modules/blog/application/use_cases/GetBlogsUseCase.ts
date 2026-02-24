import type { BlogPage } from '../../domain/models'
import type { BlogRepository } from '../../infrastructure/adapters/BlogRepository'

export class GetBlogsUseCase {
  constructor(private readonly repository: BlogRepository) {}

  async execute(params: { page: number; pageSize: number }): Promise<BlogPage> {
    return this.repository.getBlogs(params)
  }
}
