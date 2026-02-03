import type { Bank } from './Bank'

/** BanksByCountryCurrencyDTO: GET /transactions/banks/by-country-currency */
export type BanksByCountryCurrency = Record<string, Record<string, Bank[]>>
