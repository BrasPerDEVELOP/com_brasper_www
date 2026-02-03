// Modelo de dominio para Proyecto
export interface Project {
  id: string
  name: string
  description: string | null
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}
