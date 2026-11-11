import type { Coupon } from '../../domain/models'

/** Cupón de cotización exclusivo del build publicado en /promocion/. */
export function promotionCoupons(coupons: Coupon[], mode: string, baseUrl: string): Coupon[] {
  if (mode !== 'staging' || baseUrl !== '/promocion/') return coupons
  return [{
    id: 'promotion-primerenvio',
    code: 'primerenvio',
    discount: 25,
    type: 'percent',
    isAutomatic: true,
    isActive: true
  }]
}
