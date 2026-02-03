/** Códigos de moneda (igual que API: lowercase). */
export const Currency = {
  PEN: 'PEN',
  USD: 'USD',
  BRL: 'BRL'
} as const
export type Currency = (typeof Currency)[keyof typeof Currency]

export const CURRENCY_DISPLAY: Record<string, { name: string; symbol: string }> = {
  PEN: { name: 'Sol Peruano', symbol: 'S/.' },  
  USD: { name: 'Dólar', symbol: '$' },
  BRL: { name: 'Real Brasileño', symbol: 'R$' }
}
