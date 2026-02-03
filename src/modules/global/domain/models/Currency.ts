// Modelo de dominio para Moneda
export interface Currency {
  id: string
  code: string
  name: string
  symbol: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
