import assert from 'node:assert/strict'
import { test } from 'node:test'
import { promotionCoupons } from '../src/modules/calculator/infrastructure/adapters/promotionCoupons'
import type { Coupon } from '../src/modules/calculator/domain/models'

const coupons: Coupon[] = [{
  id: 'api-coupon', code: 'CYBERSOL', discount: 20, type: 'percent',
  isAutomatic: true, isActive: true
}]

test('la promoción reemplaza CYBER por primerenvio al 25 %, sin acumular descuentos', () => {
  const result = promotionCoupons(coupons, 'staging', '/promocion/')
  assert.deepEqual(result, [{
    id: 'promotion-primerenvio', code: 'primerenvio', discount: 25,
    type: 'percent', isAutomatic: true, isActive: true
  }])
  assert.equal(coupons[0].discount, 20)
  assert.equal(coupons[0].code, 'CYBERSOL')
})

test('la portada principal y otros builds conservan los cupones de la API', () => {
  for (const [mode, base] of [
    ['production', '/'], ['production', '/promocion/'], ['staging', '/'], ['development', '/promocion/']
  ]) assert.equal(promotionCoupons(coupons, mode, base), coupons)
})

test('primerenvio no depende de que haya cupones activos en la API', () => {
  assert.deepEqual(promotionCoupons([], 'staging', '/promocion/'), promotionCoupons(coupons, 'staging', '/promocion/'))
})
