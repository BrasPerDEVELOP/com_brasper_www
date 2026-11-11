import assert from 'node:assert/strict'
import { test } from 'node:test'
import { stagingCoupons } from '../src/modules/calculator/infrastructure/adapters/stagingCoupons'
import type { Coupon } from '../src/modules/calculator/domain/models'

const coupons: Coupon[] = [{
  id: 'existing-api-coupon', code: 'CYBERSOL', discount: 20, type: 'percent',
  isAutomatic: true, isActive: true, originCurrency: 'pen', destinationCurrency: 'brl',
  startDate: '2026-11-04T16:13:00Z', endDate: '2026-11-15T16:13:00Z', maxUses: 1000
}]

test('staging uses a single 25 percent coupon without mutating production coupons', () => {
  const result = stagingCoupons(coupons, 'staging', 'staging.brasper.com')
  assert.deepEqual(result, [{
    id: 'staging-marina25', code: 'MARINA25', discount: 25,
    type: 'percent', isAutomatic: true, isActive: true
  }])
  assert.equal(coupons[0].code, 'CYBERSOL')
  assert.equal(coupons[0].discount, 20)
  assert.notEqual(result[0], coupons[0])
})

test('production builds and other hosts retain the original coupons', () => {
  for (const [mode, host] of [
    ['production', 'staging.brasper.com'], ['staging', 'brasper.com'],
    ['staging', 'www.brasper.com'], ['production', 'brasper.com']
  ]) assert.equal(stagingCoupons(coupons, mode, host), coupons)
})

test('the default staging coupon is independent of production coupon availability', () => {
  assert.deepEqual(
    stagingCoupons([], 'staging', 'staging.brasper.com'),
    stagingCoupons(coupons, 'staging', 'staging.brasper.com')
  )
})
