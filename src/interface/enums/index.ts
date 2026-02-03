/**
 * Enums compartidos por la capa de interfaz y los módulos.
 * Centraliza tipos y opciones para formularios, filtros, etc.
 * Valores alineados con el backend (calculadora y transferencia).
 */

export type { DocumentType } from './DocumentType'
export { DOCUMENT_TYPES } from './DocumentType'
export type { UserRole } from './UserRole'
export { USER_ROLES } from './UserRole'
export type { PhoneCode } from './PhoneCode'
export { PHONE_CODES } from './PhoneCode'

export * from './Currency'
export * from './TransactionType'
export * from './TransactionStatus'
export * from './BankCountry'
export * from './AccountFlowType'
export * from './AccountHolderType'
