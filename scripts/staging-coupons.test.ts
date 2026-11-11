import assert from 'node:assert/strict'
import { test } from 'node:test'
import { stagingCoupons } from '../src/modules/calculator/infrastructure/adapters/stagingCoupons'
import type { Coupon } from '../src/modules/calculator/domain/models'

const coupons: Coupon[] = [{
  id: 'existing-api-coupon', code: 'CYBERSOL', discount: 20, type: 'percent',
  isAutomatic: true, isActive: true, originCurrency: 'pen', destinationCurrency: 'brl',
  startDate: '2026-11-04T16:13:00Z', endDate: '2026-11-15T16:13:00Z', maxUses: 1000
}]

test('staging preserves API amounts, eligibility and IDs without mutating the response', () => {
  const result = stagingCoupons(coupons, 'staging', 'staging.brasper.com')
  assert.deepEqual(result, [{ ...coupons[0], code: 'MARINA25' }])
  assert.equal(coupons[0].code, 'CYBERSOL')
  assert.notEqual(result[0], coupons[0])
})

test('production builds and other hosts retain the original coupons', () => {
  for (const [mode, host] of [
    ['production', 'staging.brasper.com'], ['staging', 'brasper.com'],
    ['staging', 'www.brasper.com'], ['production', 'brasper.com']
  ]) assert.equal(stagingCoupons(coupons, mode, host), coupons)
})

test('staging never invents discounts when the API returns no coupons', () => {
  assert.deepEqual(stagingCoupons([], 'staging', 'staging.brasper.com'), [])
})
