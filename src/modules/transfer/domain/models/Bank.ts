/** BankReadDTO: GET /transactions/banks/{id} o ítem en by-country-currency. */
export interface Bank {
  id: string
  bank: string
  account: string
  pix?: string
  company: string
  currency: string
  currency_display?: string
  image?: string
  country: string
}
