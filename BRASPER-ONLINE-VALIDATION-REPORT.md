# Brasper Online Validation Report

Fecha de prueba: 2026-07-13  
URL probada: https://brasper.online/pr

## Veredicto

`https://brasper.online/pr` respondía `403 Forbidden` al abrirse directamente, bloqueando Lighthouse, Googlebot y a cualquier usuario/crawler que entrara por URL directa.

> **Actualización (2026-07-13):** la causa del `403` fue identificada y **corregida en el código** (ver «Resolución»). Falta **re-desplegar** el `dist/` y el `.htaccess` actualizados para que el fix tome efecto en `brasper.online`.

## Validación HTTP

| URL | Estado | Observación |
|---|---:|---|
| `https://brasper.online/` | 200 | Carga HTML; Lighthouse termina mostrando `/pr` |
| `https://brasper.online/pr` | 403 | Crítico: landing principal bloqueada |
| `https://brasper.online/pr/` | 403 | Crítico |
| `https://brasper.online/es` | 403 | Crítico |
| `https://brasper.online/en` | 403 | Crítico |
| `https://brasper.online/pr/blog` | 200 | Correcto; HTML inicial tiene title, description, canonical, H1 y texto |
| `https://brasper.online/pr/faq` | 200 | Correcto; HTML inicial tiene title, description, canonical, H1 y texto |
| `https://brasper.online/dashboard` | 200 | Redirige/carga dashboard; debe ser `noindex` si es privado |
| `https://brasper.online/esto-no-existe` | 200 | Regresión: soft 404 |
| `https://brasper.online/robots.txt` | 200 | Apunta a `https://brasper.com/sitemap.xml` |
| `https://brasper.online/sitemap.xml` | 200 | Sitemap con URLs canónicas de `https://brasper.com/...` |
| `https://brasper.online/site.webmanifest` | 200 | Se sirve como `text/plain` |
| `https://brasper.online/favicon.ico` | 200 | Correcto |

## Prueba con user-agents

Las rutas `/pr`, `/es` y `/en` devuelven `403` con:

- Chrome normal
- Googlebot
- CodexSEO

Esto confirma que no parece un falso positivo del cliente de prueba.

## Lighthouse

### `https://brasper.online/pr`

Lighthouse no pudo auditar la URL porque el servidor respondió `403`.

### `https://brasper.online/`

Lighthouse pudo correr entrando por `/`; el navegador terminó en `/pr`.

| Métrica mobile | Resultado |
|---|---:|
| Performance | 69 |
| Accessibility | 89 |
| Best Practices | 77 |
| SEO | 100 |
| FCP | 2.4s |
| LCP | 12.0s |
| TBT | 133ms |
| CLS | 0.0004 |
| TTI | 13.9s |
| Transfer total | 3.37 MB |
| Requests | 70 |

## Recursos pesados

El recurso más pesado sigue siendo el banner principal:

- `https://media.ingenitechsac.workers.dev/backofice/home_banner/banner_pr_50b0465a.webp?...` — `~1.59 MB`

También siguen cargando varios scripts de GTM/gtag/Facebook.

## HTML inicial

### `/pr/blog`

Mejoró. El HTML inicial contiene:

- Title: `Blog da Brasper | Notícias e guias de transferências`
- Meta description
- Canonical: `https://brasper.com/pr/blog`
- H1: `Últimos artigos`
- Texto visible
- Schema JSON-LD

### `/pr/faq`

Mejoró. El HTML inicial contiene:

- Title: `Perguntas frequentes | Brasper`
- Meta description
- Canonical: `https://brasper.com/pr/faq`
- H1: `Perguntas frequentes`
- Texto visible
- Schema JSON-LD

### `/` y `/esto-no-existe`

Siguen débiles:

- Title genérico: `Brasper`
- Sin canonical inicial
- Sin H1 inicial
- Sin H2 inicial
- Ruta inexistente responde `200`

## Prioridad de corrección

1. Corregir el `403` en `/pr`, `/es` y `/en`.
2. Mantener `200` solo para rutas válidas y devolver `404` real para rutas inexistentes.
3. Optimizar/reemplazar el banner remoto de `~1.59 MB`.
4. Servir `site.webmanifest` como `application/manifest+json; charset=utf-8`.
5. Confirmar si `brasper.online` debe indexarse o si solo es dominio temporal. Si no debe indexarse, agregar `noindex`; si sí debe indexarse, canonical/sitemap/robots no deberían apuntar a `brasper.com`.

## Resolución (2026-07-13)

### 1. Causa raíz del `403` en `/pr`, `/es`, `/en`

El prerender generaba **a la vez** un archivo `dist/pr.html` **y** una carpeta `dist/pr/`
(con `blog.html` y `faq.html`). En Apache, al pedir `/pr` la regla de «carpeta existente»
tomaba el directorio `dist/pr/`, que no tiene índice y con `Options -Indexes` devuelve
`403`. Por eso `/pr/blog` y `/pr/faq` (que no son carpetas) sí funcionaban.

**Corrección:**
- La portada por idioma ahora se genera como `dist/{idioma}/index.html` (no `{idioma}.html`),
  eliminando la colisión archivo/carpeta (`scripts/prerender.ts`).
- En `public/.htaccess`, las reglas de prerender se movieron **antes** de la regla de
  carpetas y la raíz `/` redirige a la portada x-default. `/pr`, `/es`, `/en` y `/` → `200`.

Verificado en local con un servidor que imita el ruteo del `.htaccess`: `/`, `/pr`, `/pr/`,
`/es`, `/en` responden `200`, la SPA arranca sin errores y la calculadora funciona.

### 2. Soft 404 → `404` real

`public/.htaccess` ahora solo entrega `200` a rutas reconocidas (portadas prerenderizadas,
blog, faq, detalle de artículo, login/registro, dashboard y archivos existentes). Cualquier
otra ruta (`/esto-no-existe`, `/es/lo-que-sea`, `/llms.txt`, `/.well-known/security.txt`)
devuelve **`404` real**; `ErrorDocument 404 /index.html` muestra la página 404 de la SPA
(con `noindex`) conservando el estado `404`. Verificado.

### 3. `site.webmanifest` con tipo correcto

Se fuerza `Content-Type: application/manifest+json; charset=utf-8` (antes `text/plain`)
mediante `.htaccess` (`AddType` + `Header set`). Verificado.

### 4. Dashboard `noindex`

`.htaccess` envía `X-Robots-Tag: noindex, nofollow` para `^/dashboard`. (Comprobar con
`curl -I` tras el despliegue.)

### 5. Banner remoto (~1.59 MB) — depende de backend/CDN

El banner llega a resolución completa desde `media.ingenitechsac.workers.dev` y es el mayor
costo del LCP. No se puede redimensionar desde el frontend: **requiere que el backend/CDN
sirva variantes** (p. ej. 760/1024 px, WebP) con caché larga. Pendiente externo.

### 6. Dominio e indexación de `brasper.online`

`canonical`, `sitemap` y `robots` apuntan a `https://brasper.com`. El dominio canónico ahora
es **configurable** por variable de entorno (`SITE_URL`) en `prerender` y `sitemap`.
Decisión del negocio:
- Si `brasper.online` es **temporal/staging** → debe llevar `noindex` (para no competir con
  `brasper.com`); canonical→`brasper.com` es correcto.
- Si `brasper.online` es **producción** → construir con `SITE_URL=https://brasper.online` para
  que canonical/sitemap apunten a sí mismo.

## Estado final

Los bloqueadores técnicos del reporte (`403`, soft 404, tipo de `webmanifest`) están
**resueltos en el código y verificados en local**. Queda: **(a)** re-desplegar `dist/` +
`.htaccess`, **(b)** que el backend sirva el banner redimensionado, y **(c)** decidir la
indexación de `brasper.online`. Tras el re-despliegue, repetir Lighthouse sobre `/pr`
(ya no habrá `403`).
