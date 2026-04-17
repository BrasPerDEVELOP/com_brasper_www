import { env } from '@/interface/config/env'

/**
 * Construye la URL base para las peticiones.
 * Lee SSL y DOMAIN (y opcionalmente COMPANY) del env.
 * El adapter genérico usa Domain.http(path) para obtener la URL completa.
 */
export function buildBaseUrl(): string {
  const protocol = env.ssl ? 'https' : 'http'
  const domain = env.domain || 'localhost'
  return `${protocol}://${domain}`
}

/**
 * Devuelve la URL completa para un path.
 * Si hay COMPANY en env, se antepone al path: /company/path
 */
export function http(path: string): string {
  const base = buildBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const company = env.company?.trim()
  if (company) {
    const companyPrefix = company.startsWith('/') ? company : `/${company}`
    return `${base}${companyPrefix}${normalizedPath}`
  }
  return `${base}${normalizedPath}`
}

/**
 * URL absoluta para ficheros media (p. ej. home_banner/..., profile_image).
 * Misma regla que el backoffice: http(s) tal cual; media/ bajo base; resto bajo /media/.
 */
export function mediaUrl(relativePath: string): string {
  if (!relativePath || typeof relativePath !== 'string') return ''
  const trimmed = relativePath.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed

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
  http,
  mediaUrl
}
