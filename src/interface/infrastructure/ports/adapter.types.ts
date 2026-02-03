/**
 * Contratos para el adapter genérico.
 * Los adapters de cada módulo implementan AdapterPort<T> o ListAdapterPort<T>.
 */

export interface PaginationDTO<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** Adapter con operaciones CRUD por ítem */
export interface AdapterPort<T> {
  get(id: string): Promise<T | null>
  post(body: unknown): Promise<T | null>
  put(id: string, body: unknown): Promise<T | null>
  delete(id: string): Promise<boolean>
}

/** Adapter con listados y paginación */
export interface ListAdapterPort<T> {
  getList(): Promise<T[]>
  getNameList?(): Promise<{ id: string; name: string }[]>
  getPaginatedList?(page: number, pageSize: number): Promise<PaginationDTO<T>>
}

export type TryParse<T> = (json: unknown) => T | null
