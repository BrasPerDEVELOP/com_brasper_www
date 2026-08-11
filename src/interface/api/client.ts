import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig
} from 'axios'
import { Domain } from '@/interface/infrastructure/services'
import { createLoggerWithContext } from '@/interface/infrastructure/logger'

const log = createLoggerWithContext('api')

export type GetTokenFn = () => string | null
export type SetTokenFn = (token: string | null) => void
export type OnUnauthorizedFn = () => void

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _authRetry?: boolean
}

let getToken: GetTokenFn = () => null
let setToken: SetTokenFn = () => undefined
let onUnauthorized: OnUnauthorizedFn = () => undefined

export function setAuthCallbacks(
  tokenFn: GetTokenFn,
  tokenSetter: SetTokenFn,
  unauthorizedFn: OnUnauthorizedFn
): void {
  getToken = tokenFn
  setToken = tokenSetter
  onUnauthorized = unauthorizedFn
}

const baseURL = Domain.buildBaseUrl()
const apiOrigin = new URL(baseURL).origin

function targetsApi(config: Pick<InternalAxiosRequestConfig, 'url' | 'baseURL'>): boolean {
  try {
    return new URL(config.url ?? '', config.baseURL ?? baseURL).origin === apiOrigin
  } catch {
    return false
  }
}

function canonicalRequestPath(config: Pick<InternalAxiosRequestConfig, 'url' | 'baseURL'>): string {
  try {
    return new URL(config.url ?? '', config.baseURL ?? baseURL).pathname.replace(/\/+$/, '')
  } catch {
    return ''
  }
}

const PUBLIC_GET_SUFFIXES = [
  '/blog',
  '/home-banner/home-image',
  '/home-banner/home-popup',
  '/coin/currencies',
  '/coin/tax-rate',
  '/coin/commission',
  '/transactions/coupons/automatic'
]

const PUBLIC_POST_SUFFIXES = [
  '/auth/login',
  '/auth/refresh',
  '/auth/reset-password',
  '/auth/reset-password/confirm',
  '/user',
  '/brasper/contact-form'
]

/** Refleja la allowlist pública del API: estas peticiones no intentan refresh. */
function isPublicApiRequest(config: InternalAxiosRequestConfig): boolean {
  const path = canonicalRequestPath(config)
  const method = (config.method ?? 'get').toUpperCase()
  if (method === 'GET') {
    if (PUBLIC_GET_SUFFIXES.some((suffix) => path.endsWith(suffix))) return true
    return /\/(?:blog\/slug|home-banner\/home-image|home-banner\/home-popup)\/[^/]+$/.test(path)
  }
  return method === 'POST' && PUBLIC_POST_SUFFIXES.some((suffix) => path.endsWith(suffix))
}

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

const refreshClient = axios.create({ baseURL })
let refreshPromise: Promise<string> | null = null

async function requestNewAccessToken(): Promise<string> {
  const response = await refreshClient.post<unknown>(
    Domain.apiPath('auth/refresh'),
    null,
    {
      withCredentials: true,
      headers: { 'X-Client-App': 'www' }
    }
  )
  const payload = response.data as Record<string, unknown> | null
  const token = payload && typeof payload.access_token === 'string' ? payload.access_token : ''
  if (!token) throw new Error('La renovación no devolvió un access token')
  setToken(token)
  return token
}

/** Renueva una sola vez aunque varias peticiones fallen con 401 simultáneamente. */
export async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = requestNewAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

apiClient.interceptors.request.use(
  (config) => {
    const isApi = targetsApi(config)
    const isPublic = isApi && isPublicApiRequest(config)
    config.withCredentials = isApi
    if (isApi) {
      config.headers.set('X-Client-App', 'www')
      const token = getToken()
      if (token && !isPublic) config.headers.set('Authorization', `Bearer ${token}`)
      else config.headers.delete('Authorization')
    } else {
      config.headers.delete('Authorization')
    }
    if (config.data instanceof FormData) {
      const headers = AxiosHeaders.from(config.headers)
      headers.delete('Content-Type')
      config.headers = headers
    }
    if (import.meta.env.DEV && config.url) {
      log.debug(config.method?.toUpperCase(), config.url, config.params ?? '')
    }
    return config
  },
  (error: unknown) => {
    log.error('Request error', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableRequestConfig | undefined
    const status = error.response?.status
    const path = config ? canonicalRequestPath(config) : ''
    const isAuthEntryPoint = path.endsWith('/auth/login') || path.endsWith('/auth/refresh')
    const isPublic = config ? isPublicApiRequest(config) : false

    if (status === 401 && config && targetsApi(config) && !config._authRetry && !isAuthEntryPoint && !isPublic) {
      config._authRetry = true
      try {
        const token = await refreshAccessToken()
        config.headers.set('Authorization', `Bearer ${token}`)
        return await apiClient.request(config)
      } catch (refreshError) {
        setToken(null)
        onUnauthorized()
        return Promise.reject(refreshError)
      }
    }

    log.error(
      'API error',
      status ?? error.code ?? 'network',
      config?.url ?? error.request?.responseURL,
      error.response?.data ?? error.message
    )
    return Promise.reject(error)
  }
)
