/**
 * Genera public/sitemap.xml a partir de las rutas públicas localizadas y,
 * si la API del blog está accesible, de los artículos publicados.
 *
 * Uso:
 *   npx tsx scripts/generate-sitemap.ts
 *
 * Variables de entorno opcionales:
 *   SITE_URL            Base del sitio (por defecto https://brasper.com)
 *   SITEMAP_API_BASE    Base de la API del blog (por defecto https://apibras.finzeler.com)
 *   SITEMAP_SKIP_API    Si es "1", no intenta traer artículos.
 *
 * Cada URL de idioma aparece como <loc> propio con alternates recíprocos
 * (hreflang + x-default). El blog/artículos dependen de la API: si no responde,
 * el sitemap se genera solo con las páginas estáticas y se avisa por consola.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const SITE_URL = (process.env.SITE_URL ?? 'https://brasper.com').replace(/\/+$/, '')
const API_BASE = (process.env.SITEMAP_API_BASE ?? 'https://apibras.finzeler.com').replace(/\/+$/, '')
const SKIP_API = process.env.SITEMAP_SKIP_API === '1'

const LOCALES = ['pr', 'es', 'en'] as const
const HREFLANG: Record<(typeof LOCALES)[number], string> = { pr: 'pt-BR', es: 'es-PE', en: 'en-US' }
const X_DEFAULT: (typeof LOCALES)[number] = 'pr'
const STATIC_SUFFIXES = ['', '/blog', '/faq']

const TODAY = new Date().toISOString().slice(0, 10)

function altLinks(suffix: string): string {
  const links = LOCALES.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${SITE_URL}/${l}${suffix}" />`
  )
  links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${X_DEFAULT}${suffix}" />`)
  return links.join('\n')
}

function urlBlock(suffix: string, lastmod: string): string {
  return LOCALES.map(
    (l) =>
      `  <url>\n    <loc>${SITE_URL}/${l}${suffix}</loc>\n    <lastmod>${lastmod}</lastmod>\n${altLinks(suffix)}\n  </url>`
  ).join('\n')
}

interface ApiBlog {
  slug?: string
  date?: string
  updated_at?: string
  created_at?: string
  enable?: boolean
}

async function fetchArticles(): Promise<{ suffix: string; lastmod: string }[]> {
  if (SKIP_API) {
    console.warn('[sitemap] SITEMAP_SKIP_API=1: se omiten los artículos del blog.')
    return []
  }

  const out: { suffix: string; lastmod: string }[] = []
  let url: string | null = `${API_BASE}/blog/?page_size=100`

  try {
    while (url) {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(8000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: unknown = await res.json()
      const results: ApiBlog[] = Array.isArray(data)
        ? (data as ApiBlog[])
        : ((data as { results?: ApiBlog[] })?.results ?? [])

      for (const item of results) {
        const slug = typeof item.slug === 'string' ? item.slug.trim() : ''
        if (!slug || item.enable === false) continue
        const lastmod = (item.updated_at || item.date || item.created_at || TODAY).slice(0, 10)
        out.push({ suffix: `/blog/${slug}`, lastmod })
      }

      url = (data as { next?: string | null })?.next ?? null
    }
  } catch (error) {
    console.warn(
      `[sitemap] No se pudieron obtener artículos desde ${API_BASE}/blog/ (${(error as Error).message}). ` +
        'Se genera el sitemap solo con páginas estáticas.'
    )
    return []
  }

  return out
}

async function main(): Promise<void> {
  const articles = await fetchArticles()

  const blocks: string[] = []
  for (const suffix of STATIC_SUFFIXES) blocks.push(urlBlock(suffix, TODAY))
  for (const article of articles) blocks.push(urlBlock(article.suffix, article.lastmod))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join('\n')}
</urlset>
`

  const outPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml')
  writeFileSync(outPath, xml, 'utf8')
  console.log(
    `[sitemap] Escrito ${outPath} — ${STATIC_SUFFIXES.length} páginas estáticas ×${LOCALES.length} idiomas` +
      (articles.length ? ` + ${articles.length} artículos ×${LOCALES.length} idiomas.` : ' (sin artículos).')
  )
}

void main()
