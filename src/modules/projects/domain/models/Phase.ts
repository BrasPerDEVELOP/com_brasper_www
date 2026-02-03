// Modelo de dominio para Fase
export interface Phase {
  id: string
  projectId: string
  name: string
  description: string | null
  order: number
  createdAt: string
  updatedAt: string
}
