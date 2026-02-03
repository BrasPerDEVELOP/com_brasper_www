import type { Project } from '../../domain/models'
import type { ProjectsRepository } from '../../infrastructure/adapters/ProjectsRepository'

export class GetProjectsUseCase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute(): Promise<Project[]> {
    return await this.projectsRepository.getProjects()
  }
}
