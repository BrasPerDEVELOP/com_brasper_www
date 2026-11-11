import type { Coupon } from '../../domain/models'

/** Frontend-only staging coupon, using the calculator's normal commission discount. */
export function stagingCoupons(coupons: Coupon[], mode: string, hostname: string): Coupon[] {
  if (mode !== 'staging' || hostname !== 'staging.brasper.com') return coupons
  return [{
    id: 'staging-marina25',
    code: 'MARINA25',
    discount: 25,
    type: 'percent',
    isAutomatic: true,
    isActive: true
  }]
}
