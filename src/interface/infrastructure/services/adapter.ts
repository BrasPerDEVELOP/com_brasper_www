import type { AxiosResponse } from 'axios'
import { apiClient } from '@/interface/api/client'
import { Domain } from './domain'
import type { PaginationDTO, TryParse } from '../ports/adapter.types'

export type GetTokenFn = () => string | null
export type OnErrorNotifyFn = (error: unknown) => void

/**
 * Adapter genérico: centraliza URL (vía Domain/env) y parseo de respuestas.
 * Token y 401 se gestionan en apiClient (interceptors centrales).
 */
export class Adapter<T> {
  private readonly path: string
  private readonly tryParse: TryParse<T>
  private readonly onError: OnErrorNotifyFn | undefined

  constructor(
    path: string,
    tryParse: TryParse<T>,
    _getToken?: GetTokenFn,
    onError?: OnErrorNotifyFn
  ) {
    this.path = path.endsWith('/') ? path : `${path}/`
    this.tryParse = tryParse
    this.onError = onError
  }

  /** URL base para este path (Domain construye con SSL + DOMAIN + COMPANY) */
  get url(): string {
    return Domain.http(this.path)
  }

  private handleError(error: unknown): void {
    if (this.onError) {
      this.onError(error)
    }
  }

  async get(id: string): Promise<T | null> {
    try {
      const response: AxiosResponse<unknown> = await apiClient.get(`${this.url}${id}/`)
      return this.makeDTO(response.data)
    } catch (error) {
      this.handleError(error)
      return null
    }
  }

  async post(body: unknown): Promise<T | null> {
    try {
      const response: AxiosResponse<unknown> = await apiClient.post(this.url, body)
      return this.makeDTO(response.data)
    } catch (error) {
      this.handleError(error)
      return null
    }
  }

  async put(id: string, body: unknown): Promise<T | null> {
    try {
      const response: AxiosResponse<unknown> = await apiClient.put(`${this.url}${id}/`, body)
      return this.makeDTO(response.data)
    } catch (error) {
      this.handleError(error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`${this.url}${id}/`)
      return true
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  /** Lista: GET sin id, respuesta array */
  async getList(): Promise<T[]> {
    try {
      const response: AxiosResponse<unknown> = await apiClient.get(this.url)
      return this.makeDTOList(response.data)
    } catch (error) {
      this.handleError(error)
      return []
    }
  }

  makeDTO(data: unknown): T | null {
    return this.tryParse(data)
  }

  makeDTOList(data: unknown): T[] {
    if (!Array.isArray(data)) return []
    return data.map((item) => this.tryParse(item)).filter((x): x is T => x !== null)
  }

  makePagination(data: unknown): PaginationDTO<T> | null {
    if (data === null || typeof data !== 'object') return null
    const obj = data as Record<string, unknown>
    const dataList = Array.isArray(obj.data) ? obj.data : []
    const results = dataList.map((item) => this.tryParse(item)).filter((x): x is T => x !== null)
    const total = typeof obj.total === 'number' ? obj.total : results.length
    const page = typeof obj.page === 'number' ? obj.page : 1
    const pageSize = typeof obj.page_size === 'number' ? obj.page_size : results.length
    const totalPages = typeof obj.total_pages === 'number' ? obj.total_pages : Math.ceil(total / pageSize) || 1
    return { data: results, total, page, pageSize, totalPages }
  }

  makeBool(data: unknown): boolean {
    if (data === null || data === undefined) return false
    if (typeof data === 'boolean') return data
    if (typeof data === 'object' && 'success' in (data as Record<string, unknown>)) {
      return Boolean((data as Record<string, unknown>).success)
    }
    return true
  }
}
