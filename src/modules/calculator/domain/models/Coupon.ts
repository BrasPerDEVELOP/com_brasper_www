export interface Coupon {
  id: string
  code: string
  discount: number
  type: 'percent' | 'fixed'
  isAutomatic?: boolean
  maxUses?: number
  originCurrency?: string
  destinationCurrency?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
}
