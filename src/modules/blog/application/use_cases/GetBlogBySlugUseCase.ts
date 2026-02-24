import type { Blog } from '../../domain/models'
import type { BlogRepository } from '../../infrastructure/adapters/BlogRepository'

export class GetBlogBySlugUseCase {
  constructor(private readonly repository: BlogRepository) {}

  async execute(slug: string): Promise<Blog | null> {
    return this.repository.getBlogBySlug(slug)
  }
}
