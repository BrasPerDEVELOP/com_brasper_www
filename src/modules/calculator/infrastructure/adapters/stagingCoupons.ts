import type { Coupon } from '../../domain/models'

/** Staging changes only the displayed code; API eligibility and amounts stay intact. */
export function stagingCoupons(coupons: Coupon[], mode: string, hostname: string): Coupon[] {
  if (mode !== 'staging' || hostname !== 'staging.brasper.com') return coupons
  return coupons.map((coupon) => ({ ...coupon, code: 'MARINA25' }))
}
