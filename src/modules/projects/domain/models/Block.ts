// Modelo de dominio para Bloque
export interface Block {
  id: string
  phaseId: string
  name: string
  description: string | null
  order: number
  createdAt: string
  updatedAt: string
}
