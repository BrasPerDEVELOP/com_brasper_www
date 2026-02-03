/** País del banco (bancos por país/moneda, cuentas bancarias). */
export const BankCountry = {
  PE: 'pe',
  BR: 'br'
} as const
export type BankCountry = (typeof BankCountry)[keyof typeof BankCountry]

export const BANK_COUNTRY_LABEL: Record<string, string> = {
  pe: 'Perú',
  br: 'Brasil'
}
