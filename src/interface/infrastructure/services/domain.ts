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

export const Domain = {
  buildBaseUrl,
  http
}
