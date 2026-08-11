import { env } from '@/interface/config/env'

function isLocalApiHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0'
}

/** Impide transportar JWT por HTTP en hosts remotos. */
export function ensureHttpsUrl(url: string): string {
  const parsed = new URL(url)
  if (!isLocalApiHost(parsed.hostname)) parsed.protocol = 'https:'
  return parsed.toString().replace(/\/$/, '')
}

/**
 * Construye la URL base para las peticiones.
 * Lee SSL y DOMAIN (y opcionalmente COMPANY) del env.
 * El adapter genérico usa Domain.http(path) para obtener la URL completa.
 */
export function buildBaseUrl(): string {
  const protocol = env.ssl ? 'https' : 'http'
  const domain = env.domain || 'localhost'
  return ensureHttpsUrl(`${protocol}://${domain}`)
}

/**
 * Path relativo canónico para axios (`baseURL` + path).
 * Conserva query/fragmento y elimina las barras inicial/final del pathname.
 * Si existe COMPANY, lo incluye como primer segmento.
 */
export function apiPath(path: string): string {
  const suffixIndex = path.search(/[?#]/)
  const pathname = suffixIndex >= 0 ? path.slice(0, suffixIndex) : path
  const suffix = suffixIndex >= 0 ? path.slice(suffixIndex) : ''
  const canonicalPath = pathname.replace(/^\/+/, '').replace(/\/+$/, '')
  const company = env.company.trim().replace(/^\/+/, '').replace(/\/+$/, '')
  const segments = [company, canonicalPath].filter(Boolean)
  return `${segments.join('/')}${suffix}`
}

/** Devuelve una URL absoluta y canónica para el API. */
export function apiUrl(path: string): string {
  const canonicalPath = apiPath(path)
  return ensureHttpsUrl(canonicalPath ? `${buildBaseUrl()}/${canonicalPath}` : buildBaseUrl())
}

/** @deprecated Preferir apiPath() con apiClient o apiUrl() con fetch. */
export function http(path: string): string {
  return apiUrl(path)
}

/**
 * URL absoluta para ficheros media (p. ej. home_banner/..., profile_image).
 * Misma regla que el backoffice: http(s) tal cual; media/ bajo base; resto bajo /media/.
 */
export function mediaUrl(relativePath: string): string {
  if (!relativePath || typeof relativePath !== 'string') return ''
  const trimmed = relativePath.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return ensureHttpsUrl(trimmed)

  const rawBase = env.mediaBaseUrl.trim() || buildBaseUrl()
  const base = rawBase.replace(/\/$/, '')
  let path = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed

  if (path.startsWith('media/')) {
    return `${base}/${path}`
  }
  if (!path.includes('/')) {
    path = `profile_images/${path}`
  }
  return `${base}/media/${path}`
}

export const Domain = {
  buildBaseUrl,
  ensureHttpsUrl,
  apiPath,
  apiUrl,
  http,
  mediaUrl
}
