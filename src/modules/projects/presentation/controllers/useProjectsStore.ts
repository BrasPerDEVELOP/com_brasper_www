import { defineStore } from 'pinia'
import type { Project, Phase, Block, Unit } from '../../domain/models'
import { GetProjectsUseCase } from '../../application/use_cases'
import { ProjectsApiAdapter } from '../../infrastructure/adapters'

interface ProjectsState {
  projects: Project[]
  currentProject: Project | null
  phases: Phase[]
  blocks: Block[]
  units: Unit[]
  isLoading: boolean
  error: string | null
}

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectsState => ({
    projects: [],
    currentProject: null,
    phases: [],
    blocks: [],
    units: [],
    isLoading: false,
    error: null
  }),

  getters: {
    activeProjects: (state) => state.projects.filter(project => project.status === 'active')
  },

  actions: {
    async fetchProjects() {
      this.isLoading = true
      this.error = null

      try {
        const repository = new ProjectsApiAdapter()
        const getProjectsUseCase = new GetProjectsUseCase(repository)
        this.projects = await getProjectsUseCase.execute()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al cargar proyectos'
      } finally {
        this.isLoading = false
      }
    }
  }
})
