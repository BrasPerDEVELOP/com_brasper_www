import { Adapter } from '@/interface/infrastructure/services'
import type { ProjectsRepository } from './ProjectsRepository'
import type { Project, Phase, Block, Unit } from '../../domain/models'

const statuses = ['planning', 'active', 'paused', 'completed', 'cancelled'] as const

function parseProject(data: unknown): Project | null {
  if (data === null || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  if (typeof o.id !== 'string' || typeof o.name !== 'string') return null
  const status = typeof o.status === 'string' && statuses.includes(o.status as (typeof statuses)[number])
    ? (o.status as (typeof statuses)[number])
    : 'planning'
  return {
    id: String(o.id),
    name: String(o.name),
    description: o.description != null ? String(o.description) : null,
    status,
    startDate: o.startDate != null ? String(o.startDate) : o.start_date != null ? String(o.start_date) : null,
    endDate: o.endDate != null ? String(o.endDate) : o.end_date != null ? String(o.end_date) : null,
    createdAt: String(o.createdAt ?? o.created_at ?? ''),
    updatedAt: String(o.updatedAt ?? o.updated_at ?? '')
  }
}

export class ProjectsApiAdapter implements ProjectsRepository {
  private readonly projectAdapter: Adapter<Project>

  constructor() {
    this.projectAdapter = new Adapter<Project>('/project/', parseProject)
  }

  async getProjects(): Promise<Project[]> {
    return this.projectAdapter.getList()
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projectAdapter.get(id)
  }

  async getPhasesByProjectId(_projectId: string): Promise<Phase[]> {
    // Endpoint específico por proyecto; aquí devolvemos vacío o otro adapter
    return []
  }

  async getBlocksByPhaseId(_phaseId: string): Promise<Block[]> {
    return []
  }

  async getUnitsByBlockId(_blockId: string): Promise<Unit[]> {
    return []
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const created = await this.projectAdapter.post(project)
    if (created) return created
    throw new Error('Error al crear proyecto')
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const updated = await this.projectAdapter.put(id, project)
    if (updated) return updated
    throw new Error('Error al actualizar proyecto')
  }
}
