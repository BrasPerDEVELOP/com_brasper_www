import assert from 'node:assert/strict'
import test from 'node:test'
import { findCommissionRangeForAmount, type CommissionRange } from '../src/modules/calculator/domain/models/CommissionRange'

test('commission lookup rejects below-minimum amounts in both swapped directions', () => {
  const ranges: CommissionRange[] = [
    { id: 'brl-pen', coin_a: 'brl', coin_b: 'pen', min_amount: 100, max_amount: 300, percentage: 5, reverse: 0.95 },
    { id: 'pen-brl', coin_a: 'pen', coin_b: 'brl', min_amount: 100, max_amount: 300, percentage: 5, reverse: 0.95 }
  ]

  for (const pair of [['brl', 'pen'], ['pen', 'brl']] as const) {
    const pairRanges = ranges.filter((range) => range.coin_a === pair[0] && range.coin_b === pair[1])
    assert.equal(findCommissionRangeForAmount(pairRanges, 90), null)
    assert.equal(findCommissionRangeForAmount(pairRanges, 100)?.min_amount, 100)
  }
})
