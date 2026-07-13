/**
 * Prerender de las rutas públicas (post-build).
 *
 * La app es una SPA: sin esto, /es, /pr y /en entregan el mismo index.html genérico
 * (lang="pt-BR", <title>Brasper</title>, sin canonical/hreflang) a cualquier crawler o
 * scraper que no ejecute JS. Este script genera, a partir de dist/index.html, un HTML por
 * idioma y ruta con el <head> correcto (lang, title, description, canonical, hreflang, OG)
 * y un bloque de contenido localizado real dentro de #app (Vue lo reemplaza al hidratar).
 * Además inlinea el CSS principal para eliminar el render-blocking.
 *
 * El ruteo por URL limpia (/es → es.html, /es/faq → es/faq.html) lo hace public/.htaccess.
 * Se ejecuta como `postbuild`. Rutas dinámicas (detalle de blog, dashboard) siguen usando
 * el index.html SPA como fallback.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')
const SITE = 'https://brasper.com'

const LOCALES = ['pr', 'es', 'en'] as const
type Loc = (typeof LOCALES)[number]
const LANG_TAG: Record<Loc, string> = { pr: 'pt-BR', es: 'es-PE', en: 'en-US' }
const OG_LOCALE: Record<Loc, string> = { pr: 'pt_BR', es: 'es_PE', en: 'en_US' }
const APP_LOCALE: Record<Loc, string> = { pr: 'pt', es: 'es', en: 'en' }

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// vue-i18n usa {'|'} para escapar el pipe literal; en HTML estático es un | normal.
function unescapePipe(s: string): string {
  return s.replace(/\{'\|'\}/g, '|')
}

function loadMessages(loc: Loc): Record<string, string> {
  const file = resolve(ROOT, 'src/interface/presentation/i18n', `${APP_LOCALE[loc]}.json`)
  return JSON.parse(readFileSync(file, 'utf8'))
}

function t(msgs: Record<string, string>, key: string): string {
  return unescapePipe(msgs[key] ?? key)
}

/** Contenido localizado que ven los crawlers sin JS; Vue lo reemplaza al montar. */
function homeContent(m: Record<string, string>): string {
  const step = (n: number) =>
    `<li style="margin:0 0 10px"><strong>${esc(t(m, `landing_step_${n}_title`))}.</strong> ${esc(t(m, `landing_step_${n}_description`))}</li>`
  const feat = (n: number) => `<li style="margin:0 0 6px">${esc(t(m, `landing_feature_${n}_title`))}</li>`
  return `
    <h1 style="font-size:2rem;line-height:1.15;margin:22px 0 10px">${esc(t(m, 'landing_title'))}</h1>
    <p style="font-size:1.05rem;margin:0 0 8px">${esc(t(m, 'landing_description'))}</p>
    <p style="color:#5c6479;margin:0 0 26px">${esc(t(m, 'seo_home_description'))}</p>
    <h2 style="font-size:1.3rem;margin:0 0 12px">${esc(t(m, 'landing_section_process_title'))}</h2>
    <ol style="padding-left:20px;margin:0 0 26px">${step(1)}${step(2)}${step(3)}</ol>
    <h2 style="font-size:1.3rem;margin:0 0 12px">${esc(t(m, 'landing_section_advantages_title'))}</h2>
    <ul style="padding-left:20px;margin:0 0 8px">${feat(1)}${feat(2)}${feat(3)}${feat(4)}</ul>`
}

function faqContent(m: Record<string, string>): string {
  const qa = [1, 2, 3, 4]
    .map(
      (n) =>
        `<dt style="font-weight:600;margin:16px 0 4px">${esc(t(m, `landing_faq_${n}_question`))}</dt>` +
        `<dd style="margin:0;color:#5c6479">${esc(t(m, `landing_faq_${n}_answer`))}</dd>`
    )
    .join('')
  return `
    <h1 style="font-size:2rem;line-height:1.15;margin:22px 0 10px">${esc(t(m, 'landing_section_faq_title'))}</h1>
    <p style="color:#5c6479;margin:0 0 20px">${esc(t(m, 'faq_intro'))}</p>
    <dl style="margin:0">${qa}</dl>`
}

function blogContent(m: Record<string, string>): string {
  return `
    <h1 style="font-size:2rem;line-height:1.15;margin:22px 0 10px">${esc(t(m, 'blog_latest_heading'))}</h1>
    <p style="color:#5c6479;margin:0">${esc(t(m, 'seo_blog_description'))}</p>`
}

function faqJsonLd(m: Record<string, string>): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3, 4].map((n) => ({
      '@type': 'Question',
      name: t(m, `landing_faq_${n}_question`),
      acceptedAnswer: { '@type': 'Answer', text: t(m, `landing_faq_${n}_answer`) }
    }))
  }
  // data-jsonld="faq" para que useJsonLd de FaqView reutilice este bloque al hidratar
  // (lo actualiza en vez de duplicar el FAQPage).
  return `<script type="application/ld+json" data-jsonld="faq">${JSON.stringify(data)}</script>`
}

interface RouteDef {
  suffix: string
  outFile: (loc: Loc) => string
  titleKey: string
  descKey: string
  content: (m: Record<string, string>) => string
  ogImage: (loc: Loc) => string
  extraHead?: (m: Record<string, string>) => string
}

const ROUTES: RouteDef[] = [
  {
    suffix: '',
    outFile: (loc) => `${loc}.html`,
    titleKey: 'seo_home_title',
    descKey: 'seo_home_description',
    content: homeContent,
    ogImage: (loc) => `${SITE}/assets/images/banner/${loc}-1152.webp`
  },
  {
    suffix: '/faq',
    outFile: (loc) => `${loc}/faq.html`,
    titleKey: 'seo_faq_title',
    descKey: 'seo_faq_description',
    content: faqContent,
    ogImage: () => `${SITE}/assets/images/logo/logo-completo-332.png`,
    extraHead: faqJsonLd
  },
  {
    suffix: '/blog',
    outFile: (loc) => `${loc}/blog.html`,
    titleKey: 'seo_blog_title',
    descKey: 'seo_blog_description',
    content: blogContent,
    ogImage: () => `${SITE}/assets/images/logo/logo-completo-332.png`
  }
]

function hreflangLinks(suffix: string): string {
  const links = LOCALES.map(
    (l) => `<link rel="alternate" hreflang="${LANG_TAG[l]}" href="${SITE}/${l}${suffix}">`
  )
  links.push(`<link rel="alternate" hreflang="x-default" href="${SITE}/pr${suffix}">`)
  return links.join('\n    ')
}

function buildHead(loc: Loc, route: RouteDef, m: Record<string, string>): string {
  const url = `${SITE}/${loc}${route.suffix}`
  const title = esc(t(m, route.titleKey))
  const desc = esc(t(m, route.descKey))
  const img = esc(route.ogImage(loc))
  const blocks = [
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:locale" content="${OG_LOCALE[loc]}">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${desc}">`,
    `<meta name="twitter:image" content="${img}">`,
    hreflangLinks(route.suffix)
  ]
  if (route.extraHead) blocks.push(route.extraHead(m))
  return blocks.join('\n    ')
}

function transform(base: string, loc: Loc, route: RouteDef, m: Record<string, string>): string {
  const title = esc(t(m, route.titleKey))
  const desc = esc(t(m, route.descKey))
  const img = esc(route.ogImage(loc))
  let html = base
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${LANG_TAG[loc]}">`)
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
  html = html.replace(/<meta\s+name="description"[\s\S]*?>/, `<meta name="description" content="${desc}">`)
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`)
  html = html.replace(/<meta\s+property="og:description"[\s\S]*?>/, `<meta property="og:description" content="${desc}">`)
  html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${img}">`)
  html = html.replace('</head>', `  ${buildHead(loc, route, m)}\n  </head>`)
  const fallback =
    `<div style="max-width:820px;margin:0 auto;padding:44px 20px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#131834">` +
    `<span style="font-weight:800;letter-spacing:-.02em;font-size:1.15rem;color:#4a52d8">Brasper</span>` +
    route.content(m) +
    `</div>`
  html = html.replace('<div id="app"></div>', `<div id="app">${fallback}</div>`)
  return html
}

function inlineCss(base: string): string {
  const match = base.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
  if (!match) return base
  const cssPath = resolve(DIST, `.${match[1]}`)
  if (!existsSync(cssPath)) return base
  const css = readFileSync(cssPath, 'utf8')
  return base.replace(match[0], `<style>${css}</style>`)
}

function main(): void {
  const indexPath = resolve(DIST, 'index.html')
  if (!existsSync(indexPath)) {
    console.error('[prerender] No existe dist/index.html; ejecuta el build primero.')
    process.exit(1)
  }

  // Base con CSS inlineado (elimina el <link> render-blocking).
  const base = inlineCss(readFileSync(indexPath, 'utf8'))

  // El propio index.html (fallback SPA) también sin CSS bloqueante.
  writeFileSync(indexPath, base, 'utf8')

  let count = 0
  for (const loc of LOCALES) {
    const m = loadMessages(loc)
    for (const route of ROUTES) {
      const out = resolve(DIST, route.outFile(loc))
      mkdirSync(dirname(out), { recursive: true })
      writeFileSync(out, transform(base, loc, route, m), 'utf8')
      count += 1
    }
  }
  console.log(`[prerender] ${count} páginas generadas (${LOCALES.length} idiomas × ${ROUTES.length} rutas) + CSS inlineado.`)
}

main()
