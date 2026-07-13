# Estado de implementación SEO — Brasper

Fecha: 8 de julio de 2026
Rama: `acastillo`
Alcance de esta tanda: ejecutar todo lo del roadmap que es implementable **dentro del
repositorio** sin depender de accesos externos, verificarlo y dejar documentado con
motivo lo que sí depende de terceros.

> Hallazgo clave: el sitio se sirve con **Apache** (`public/.htaccess`), no con Nginx
> como asumían las auditorías. Por eso los 404, cabeceras y archivos especiales se
> resuelven en el repo y no quedan bloqueados por "acceso a Nginx".

---

## 1. Hecho y verificado

### Rendimiento (Sprint 1)

- **Banner LCP (PERF-01).** Generadas variantes WebP `480/768/1152` de cada banner local
  (`cwebp`). La variante móvil pasó de ~830 KB a **~30 KB**. `HomeHeroBanner.vue` ahora usa
  `srcset`/`sizes`; el `src` base es la variante de 768. El banner remoto del CMS (campaña)
  se mantiene como estaba: sigue siendo una función comercial.
  - Archivos: `src/modules/home/presentation/sections/HomeHeroBanner.vue`,
    `public/assets/images/banner/{es,en,pr}-{480,768,1152}.webp`,
    `src/modules/home/presentation/bodies/HomepageView.vue` (OG image → variante 1152).
- **Chatbot (PERF-02).** `bot.gif` (1.35 MB, 1600×1200) → `bot.webp` animado (**56 KB**, 160×120)
  con `gif2webp`. El widget ya se cargaba en `requestIdleCallback`. Archivo: `src/main.ts`.
- **Bundle (PERF-04).** `manualChunks` en `vite.config.ts` separa vendors. El chunk de
  entrada bajó de **285 KB → 81 KB**; los vendors (vue/router/pinia, i18n, iconify) quedan
  en chunks cacheables entre despliegues. Swiper no se incluye (no se usa en el código).

### Indexación y on-page (Sprint 2)

- **Canonical (TECH-02).** `useSeo.ts` construye canonical y hreflang desde `route.path`
  (sin query ni hash). Verificado: `/es/faq?utm_source=test#faq` → canonical `/es/faq`.
- **Un solo `h1` y jerarquía (TECH-02).** `CalculatorView` acepta `titleTag` (por defecto
  `h1`); en el hero y en el paso 1 del dashboard se usa `h2`. La página de FAQ pasó a
  `h1 → h2`. Verificado: la portada tiene **un solo `h1`**.
- **404 (TECH-03).** Nueva `NotFoundView.vue` (localizada, `robots: noindex,follow`) con
  ruta catch-all localizada y genérica. `.htaccess` devuelve **404 real** a rutas con
  extensión de archivo inexistentes (`/llms.txt`, `/.well-known/security.txt`, etc.) en
  lugar del `index.html` (elimina el soft 404). Verificado: `/es/ruta-inexistente` → vista
  404 con `noindex`.
- **Sitemap (TECH-04).** `public/sitemap.xml` regenerado: cada URL de idioma es un `<loc>`
  propio con alternates recíprocos y `lastmod`. `scripts/generate-sitemap.ts`
  (`npm run sitemap:generate`) añade los artículos publicados cuando la API responde.

### Schema (Sprint 3)

- **JSON-LD (DATA-01).**
  - `Organization` + `WebSite` **estáticos** en `index.html` (presentes sin ejecutar JS).
  - `FAQPage` en la página de FAQ (4 preguntas visibles).
  - `BlogPosting` + `BreadcrumbList` en el detalle de artículo.
  - Composable reutilizable: `src/interface/presentation/composables/useJsonLd.ts`.
  - Solo datos verificables: nombre, URL, logo, `areaServed` (BR/PE/US), teléfono de
    WhatsApp. **No** se declaran licencias, ratings ni perfiles sociales inventados.

### Cabeceras y archivos (Sprint 3 — OPS-01)

- `.htaccess`: `Strict-Transport-Security`, `Permissions-Policy`, `ServerSignature Off`,
  `X-Robots-Tag: noindex,nofollow` para `/dashboard`, y **CSP en `Report-Only`** (lista de
  orígenes conocidos) para validar sin romper GTM/GA/Ads/Meta/Cloudinary/n8n/API.
- `public/site.webmanifest` real + iconos `192/512` + `apple-touch-icon` + `theme-color`.
- `security.txt`/`llms.txt`: **no** se publican (sin contenido válido) → ahora devuelven 404.

### Verificación

- `npm run build` (incluye `vue-tsc`): **OK**, sin errores de tipos.
- Preview (`vite dev`) sobre `/es`, `/es/faq`, `/es/ruta-inexistente`: sin errores de consola.
- Calculadora (función comercial crítica): **funciona** (300 PEN → 431.42 BRL con tasa de la API).

---

## 2. Bloqueado por dependencias externas (con motivo)

| Tarea | Motivo | Qué se necesita |
|---|---|---|
| **PERF-03** deduplicar `gtag.js`/GTM | No se puede saber si GTM ya carga `G-C19S7JH1FP` sin ver el contenedor. Quitarlo a ciegas rompería la medición en un sitio financiero en producción. | Acceso a GTM para confirmar qué tags gestiona y retirar la carga directa duplicada. |
| **PERF-01** banner remoto | El banner del CMS (`apibras.finzeler.com/media/...`) llega a resolución completa (~1.5 MB) y no se puede redimensionar en el cliente. | Que el backend/CDN sirva variantes redimensionadas (o un parámetro de transformación). |
| **TRUST-01** legal / E-E-A-T | No se inventan razón social, jurisdicción, licencias ni direcciones. | Contenido legal/regulatorio verificable del negocio. |
| **TECH-04** artículos en sitemap | La API del blog no era accesible desde este entorno de build. | Ejecutar `npm run sitemap:generate` en el pipeline de deploy (con red a la API). |
| **QA-01** Lighthouse/campo | Requiere despliegue en staging/producción y Search Console. | Deploy + medición de campo. |

---

## 3. No abordado en esta tanda (decisión pendiente)

- **TECH-01 Prerender/SSG.** Es el arreglo SEO de mayor impacto (HTML localizado y con
  contenido antes de JS), pero es un cambio de arquitectura de alto riesgo para una app
  financiera en producción: `vite-ssg`/SSR exige que el árbol sea seguro en Node
  (hay `localStorage`/`window`/`new Image()`/llamadas a la API en varios puntos) y que la
  API esté disponible durante el build del blog. No debe hacerse a ciegas en una sola
  pasada autónoma. **Recomendación:** abordarlo como tarea dedicada con validación en
  staging. Mientras tanto, el `Organization`/`WebSite` estático en `index.html` da a los
  rastreadores señales de entidad sin JS, y `useSeo` mantiene la localización en cliente
  (Google renderiza JS).

---

## 4. Cómo re-verificar

```bash
npm run build                 # typecheck + build
npm run sitemap:generate      # regenera sitemap (usa la API si está accesible)
npm run dev                   # revisar /es, /es/faq, /es/ruta-inexistente
```

Comprobaciones sobre el HTML renderizado (no solo el DOM):
- un solo `<h1>` en la portada; título de la calculadora en `h2`;
- `canonical`/`hreflang` sin query ni hash;
- bloques `application/ld+json` por tipo de página;
- rutas inexistentes con extensión → 404 real.

---

## 5. Re-test (ronda 2) — verificación exhaustiva

Se re-probó cada ruta en vivo y se corrió una auditoría adversarial (21 agentes) que
cruzó **todos** los hallazgos de los informes contra el código, el `dist/` y la evidencia
de runtime. **La ronda 1 NO estaba completa**: el re-test encontró y corrigió 10 defectos
adicionales (todos verificados en vivo):

- **FIX-1 (alta):** `/auth` y `/register` eran **indexables** con canonical/título heredados
  de la página anterior (`meta.robots` nunca se consumía). Ahora `noindex,follow` con su
  propio canonical; `useSeo` además usa `route.meta.robots` como fallback.
- **FIX-7 (alta):** vue-i18n interpreta `|` como separador de plural → el título de la
  portada era solo **"Brasper"**. Escapado como `{'|'}`; ahora los títulos salen completos.
- **FIX-8 (media):** título/description no cambiaban al conmutar idioma en caliente
  (objeto estático). Ahora se pasan como `computed` reactivo (home/faq/blog).
- **FIX-3 (media):** el detalle de blog tenía **2 `h1`** (el CMS repite el título en el
  `v-html`); se bajan un nivel los encabezados del contenido.
- **FIX-2 (media):** `h1` "Últimos artículos" hardcodeado en español → localizado.
- **FIX-4 + FIX-9 (peso muerto):** se retiraron de producción `bot.gif` (1.3 MB), mockups
  `/design/*.html` rastreables, banners full-size huérfanos y ~5.9 MB de imágenes sin usar
  (`home/horario*.png`, `home/es.webp`, `img_video2-332.png`). `public/assets` 14 MB → 4.2 MB.
- **FIX-10 (varios):** `/favicon.ico` real (antes daba 404 por la regla de assets);
  `X-XSS-Protection` → `0` (obsoleto); no se emite `hreflang` en páginas noindex; sitemap
  cableado a `prebuild`; `BlogPosting` referencia el `@id` de `#organization` y acota headline.

### Ronda 3 — pendientes crítico/medio COMPLETADOS

Las tres tareas corregibles en el repo quedaron hechas y verificadas en vivo (servidor que
imita el ruteo de `.htaccess` sobre `dist/`):

- **C1 · TECH-01 prerender público (crítico) — HECHO.** `scripts/prerender.ts` (postbuild)
  genera 9 HTML (`/es,/en,/pr` × home/faq/blog) desde `dist/index.html` con `lang`, `title`,
  `description`, `canonical`, `hreflang` recíproco + `x-default`, OG por idioma y un bloque de
  contenido localizado real dentro de `#app` (Vue lo reemplaza al montar). `public/.htaccess`
  sirve el archivo por URL limpia (`/es`→`es.html`, `/`→`pr.html`). Verificado por `curl`
  (pre-JS): cada URL entrega su idioma/título/canonical/hreflang correctos; la SPA arranca
  bien (calculadora 300→431 BRL, sin errores de consola), sin `h1` ni `FAQPage` duplicados.
  El detalle de blog (dinámico) y el dashboard siguen usando el `index.html` SPA como fallback.
- **C1b · CSS bloqueante — HECHO.** El prerender inlinea el `index-*.css` en `<style>` y quita
  el `<link>` render-blocking en todos los HTML.
- **C2 · Localización — HECHO.** `BlogListView.vue` y `FaqSection.vue` movidos a claves i18n
  (filtros, buscador, estados, paginación, botones, copy de FAQ) en `es/en/pt`.
- **C3 · Imágenes — HECHO.** Convertidas a WebP y repunteadas: `acerca/img1·img2`,
  `projects/img_video2·img-video1`, `bancos/yapeplin` (~1.87 MB → ~148 KB) + `loading=lazy`;
  eliminados 4 logos de banco huérfanos. `public/assets` 14 MB → **2.1 MB**, `dist` → **3.4 MB**.

**Bloqueado por accesos externos (único pendiente):** banner remoto redimensionado
(backend/CDN), dedup gtag/GTM (acceso GTM), artículos del blog en sitemap (API en el pipeline),
páginas legales/E-E-A-T (contenido del negocio), verificación de cabeceras `.htaccess`
(staging Apache). El SSR completo del cuerpo del blog dinámico requeriría la API en build.
