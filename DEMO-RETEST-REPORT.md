# Brasper Demo Retest Report

Fecha de prueba: 2026-07-08  
URL principal: https://demo.brasper.online/pr

## Resultado ejecutivo

El deploy de demo mejoró: `/pr`, `/es`, `/en`, `/pr/blog` y `/pr/faq` ya responden `200`, por lo que Lighthouse puede auditar la landing real. Sin embargo, todavía no está listo para pasar a producción SEO sin ajustes:

1. `/esto-no-existe` responde `200`, regresó el problema de soft 404.
2. El HTML inicial sigue siendo shell SPA: sin canonical, sin H1, sin links internos y con `title` genérico.
3. Mobile Lighthouse está en zona media: Performance `72`, LCP `6.1s`.
4. El banner remoto `apibras.finzeler.com/.../banner_pr_50b0465a.webp` sigue pesando aproximadamente `1.59 MB`.
5. `site.webmanifest` responde `200`, pero se sirve como `text/plain` en vez de `application/manifest+json`.

## Validación HTTP

| URL | Estado | Observación |
|---|---:|---|
| `https://demo.brasper.online/` | 200 | SPA shell |
| `https://demo.brasper.online/pr` | 200 | Corregido: antes daba 404 |
| `https://demo.brasper.online/pr/` | 200 | Corregido |
| `https://demo.brasper.online/es` | 200 | Corregido |
| `https://demo.brasper.online/en` | 200 | Corregido |
| `https://demo.brasper.online/pr/blog` | 200 | Corregido |
| `https://demo.brasper.online/pr/faq` | 200 | Corregido |
| `https://demo.brasper.online/dashboard` | 200 | Funciona, debe quedar `noindex` si es privada |
| `https://demo.brasper.online/esto-no-existe` | 200 | Regresión: soft 404 |
| `https://demo.brasper.online/robots.txt` | 200 | Apunta al sitemap de producción |
| `https://demo.brasper.online/sitemap.xml` | 200 | Sitemap contiene URLs de `https://brasper.com/...` |
| `https://demo.brasper.online/site.webmanifest` | 200 | Content-Type incorrecto: `text/plain` |
| `https://demo.brasper.online/favicon.ico` | 404 | Favicon faltante |

## HTML inicial vs renderizado

Fetch inicial de `https://demo.brasper.online/pr`:

| Elemento | Resultado |
|---|---|
| Status | 200 |
| Title | `Brasper` |
| Meta description | Presente |
| Canonical | No presente |
| H1 | 0 |
| H2 | 0 |
| Links internos | 0 |
| Imágenes | 0 |
| Schema JSON-LD | 1 bloque |
| Word count | 1 |

Lighthouse renderizado con JS sí valida canonical/hreflang y SEO marca `100`, pero el HTML inicial continúa débil para bots que no renderizan JavaScript de forma completa.

## Lighthouse en `/pr`

### Mobile

| Métrica | Resultado |
|---|---:|
| Performance | 72 |
| Accessibility | 89 |
| Best Practices | 77 |
| SEO | 100 |
| FCP | 2.7s |
| LCP | 6.1s |
| TBT | 120ms |
| CLS | 0.001 |
| Speed Index | 3.5s |
| TTI | 12.9s |
| Transfer total | 4.26 MB |
| Requests | 69 |

### Desktop

| Métrica | Resultado |
|---|---:|
| Performance | 85 |
| Accessibility | 89 |
| Best Practices | 77 |
| SEO | 100 |
| FCP | 0.9s |
| LCP | 2.5s |
| TBT | 0ms |
| CLS | 0.001 |
| Speed Index | 1.3s |
| TTI | 2.5s |
| Transfer total | 4.77 MB |
| Requests | 71 |

## Recursos más pesados detectados

1. `https://apibras.finzeler.com/media/home_banner/banner_pr_50b0465a.webp?...` — `1.59 MB`
2. `https://demo.brasper.online/assets/images/acerca/img1.png` — `462 KB`
3. `https://demo.brasper.online/assets/projects/img_video2.png` — `435 KB` en desktop
4. `https://demo.brasper.online/assets/images/acerca/img2.png` — `309 KB`
5. `https://demo.brasper.online/assets/images/bancos/yapeplin.png` — `292 KB`
6. Scripts duplicados/pesados de GTM, gtag y Facebook Pixel.

## Accesibilidad pendiente

Lighthouse sigue marcando fallas en:

- `color-contrast`
- `heading-order`
- `link-in-text-block`
- `target-size`

## Veredicto

Estado actual: **mejoró, pero todavía no aprobaría el pase final a producción**.

Bloqueadores antes de publicar:

1. Restaurar 404 real para rutas inexistentes, sin romper las rutas válidas SPA.
2. Agregar canonical, hreflang, H1 y contenido crítico en HTML inicial mediante prerender/SSG o generación estática por ruta pública.
3. Cambiar el banner remoto pesado por las variantes optimizadas locales/responsive.
4. Servir `site.webmanifest` con `application/manifest+json; charset=utf-8`.
5. Definir si demo debe ser indexable. Si no debe indexarse, agregar `noindex` en demo y evitar sitemap/canonical hacia demo.

## Artefactos

- Lighthouse mobile JSON: `.seo-cache/lighthouse-demo/demo-pr-retest-mobile.report.report.json`
- Lighthouse mobile HTML: `.seo-cache/lighthouse-demo/demo-pr-retest-mobile.report.report.html`
- Lighthouse desktop JSON: `.seo-cache/lighthouse-demo/demo-pr-retest-desktop.report.report.json`
- Lighthouse desktop HTML: `.seo-cache/lighthouse-demo/demo-pr-retest-desktop.report.report.html`
