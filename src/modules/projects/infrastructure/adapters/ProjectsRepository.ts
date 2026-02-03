import type { Project, Phase, Block, Unit } from '../../domain/models'

export interface ProjectsRepository {
  getProjects(): Promise<Project[]>
  getProjectById(id: string): Promise<Project | null>
  getPhasesByProjectId(projectId: string): Promise<Phase[]>
  getBlocksByPhaseId(phaseId: string): Promise<Block[]>
  getUnitsByBlockId(blockId: string): Promise<Unit[]>
  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>
  updateProject(id: string, project: Partial<Project>): Promise<Project>
}
