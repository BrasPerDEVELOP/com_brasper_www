/** Origen o destino de la cuenta (cuentas bancarias). */
export const AccountFlowType = {
  ORIGIN: 'origin',
  DESTINATION: 'destination'
} as const
export type AccountFlowType = (typeof AccountFlowType)[keyof typeof AccountFlowType]
