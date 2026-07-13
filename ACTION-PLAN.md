# Plan de acción SEO — Brasper

## Crítico — esta semana

| Acción | Resultado esperado | Esfuerzo |
|---|---|---:|
| Prerenderizar o usar SSR/SSG en portada, FAQ, listado y detalle de blog para cada idioma | HTML indexable con contenido y metadatos correctos sin depender de JS | 3–6 días |
| Corregir Nginx para devolver 404 reales y crear una ruta 404 en Vue | Elimina soft 404 e indexación de URLs basura | 0.5–1 día |
| Generar banner remoto en 760/1024 px, comprimirlo y usar `srcset` | Reducir drásticamente LCP y ~1.57 MB desperdiciados | 0.5–1 día |
| Reemplazar `bot.gif` por WebM/MP4/WebP optimizado | Ahorrar ~1.35 MB | 0.5 día |
| Auditar GTM y eliminar `gtag.js` duplicado del HTML si GTM ya gestiona GA4 | Menos red y bloqueo en el hilo principal | 0.5 día |

### Criterios de aceptación

- `curl https://brasper.com/es` contiene contenido español, `lang="es-PE"`, title, canonical, hreflang y JSON-LD.
- Una URL inexistente devuelve HTTP 404.
- Cada URL privada devuelve `noindex` desde el HTML/cabecera o queda fuera del servidor público.
- Lighthouse móvil: LCP < 2.5 s, TBT < 200 ms, Performance ≥ 80 como primer objetivo.

## Alto — 1 a 2 semanas

| Acción | Resultado esperado | Esfuerzo |
|---|---|---:|
| Generar sitemap desde rutas públicas + API del blog; incluir los tres idiomas y `lastmod` | Cobertura completa y descubrimiento de artículos | 1–2 días |
| Construir canonical sin query/hash y definir reglas para paginación/búsqueda | Evitar duplicados | 0.5 día |
| Añadir JSON-LD de entidad, sitio, FAQ, artículo y breadcrumbs | Entidad comprensible y elegibilidad para resultados enriquecidos | 1–2 días |
| Dejar un solo `h1` y corregir jerarquía de headings | Mejor semántica y accesibilidad | 0.5 día |
| Publicar página institucional/regulatoria sólida | Mejor E-E-A-T para un tema financiero YMYL | 1–3 días de contenido/legal |
| Configurar HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy` y ocultar versión de Nginx | Seguridad y confianza técnica | 0.5–1 día |

## Medio — 30 días

- Crear páginas útiles por intención y corredor: Brasil → Perú, Perú → Brasil, transferencias en USD, tasas, comisiones, tiempos, requisitos y seguridad.
- Añadir autor, revisor, fuentes, `datePublished` y `dateModified` a cada artículo.
- Convertir PNG/JPG pesados a AVIF/WebP y generar tamaños responsive.
- Corregir contrastes y objetivos táctiles señalados por Lighthouse.
- Servir un `llms.txt` real solo después de consolidar páginas canónicas y contenido citable.
- Crear `site.webmanifest`, favicon real y `security.txt`, o devolver 404 si no se van a publicar.

## Medición

1. Crear baseline en Search Console por país, idioma y tipo de página.
2. Seguir semanalmente páginas indexadas, soft 404, impresiones, CTR y posición.
3. Medir LCP/INP/CLS de campo en Search Console/CrUX, no solo Lighthouse.
4. Repetir Lighthouse móvil tras cada lote de optimización.
5. Validar hreflang, canonical y schema sobre el HTML descargado, no únicamente en el DOM renderizado.

## Orden técnico recomendado

1. Optimizar banner/chat y limpiar tags de terceros.
2. Implementar prerender/SSR.
3. Corregir respuestas 404/noindex en Nginx.
4. Automatizar sitemap.
5. Añadir schema y ampliar contenido/E-E-A-T.
