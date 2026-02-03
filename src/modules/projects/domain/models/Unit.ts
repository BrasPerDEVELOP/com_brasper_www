// Modelo de dominio para Unidad
export interface Unit {
  id: string
  blockId: string
  name: string
  number: string
  area: number
  price: number
  status: 'available' | 'reserved' | 'sold'
  createdAt: string
  updatedAt: string
}
