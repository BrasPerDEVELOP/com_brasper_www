import type { CurrencyCode } from './CurrencyCode'

/** CommissionReadDTO: para calcular comisión y enviar commission_id en POST /transactions/. */
export interface CommissionRange {
  id: string
  coin_a: CurrencyCode
  coin_b: CurrencyCode
  percentage: number
  reverse: number
  min_amount: number
  max_amount: number
}

export function findCommissionRangeForAmount(
  ranges: CommissionRange[],
  amount: number
): CommissionRange | null {
  if (ranges.length === 0 || amount < ranges[0].min_amount) return null

  const matchingRange = ranges.find(
    (range) => amount >= range.min_amount && amount <= range.max_amount
  )
  if (matchingRange) return matchingRange

  const lastRange = ranges[ranges.length - 1]
  return amount > lastRange.max_amount ? lastRange : null
}
