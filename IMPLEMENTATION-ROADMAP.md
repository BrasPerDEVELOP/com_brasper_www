# Roadmap de implementación SEO — Brasper

Fecha: 8 de julio de 2026  
Duración estimada: 3 sprints / 15 días hábiles  
Objetivo: pasar de un SEO Health Score de 52/100 a una base técnica indexable, rápida y medible.

## Resultado final esperado

Al cerrar este roadmap:

- las rutas públicas entregan HTML completo y localizado sin depender de JavaScript;
- las rutas inexistentes responden 404 y las privadas no son indexables;
- el sitemap incluye las páginas públicas y artículos publicados en los tres idiomas;
- cada página tiene canonical, hreflang, title, description, Open Graph y schema correctos;
- la portada transfiere menos de 2 MiB en móvil;
- Lighthouse móvil alcanza al menos 80, LCP de laboratorio baja de 2.5 s, TBT queda debajo de 200 ms y CLS debajo de 0.1;
- Search Console y GA4 permiten medir indexación, tráfico y conversiones.

## Decisión técnica inicial

Usar **prerender/SSG para las rutas públicas** y mantener el dashboard como SPA.

Es la opción recomendada porque portada, FAQ y listado del blog son mayormente públicos y estables. Los artículos pueden generarse durante el despliegue desde la API. Si el blog debe publicarse inmediatamente sin volver a desplegar, usar SSR para el detalle del artículo.

No conviene migrar toda la aplicación a SSR antes de corregir imágenes y scripts: el servidor podría entregar HTML más rápido, pero el LCP seguiría siendo malo por los 5–7 MiB descargados.

## Dependencias externas que deben estar disponibles

- acceso a la configuración Nginx/hosting de `brasper.com`;
- acceso a GTM, GA4, Google Ads y Meta Pixel;
- acceso al backend o CDN que entrega banners desde `apibras.finzeler.com`;
- listado/API de artículos publicados con slug, idioma, fechas, autor e imagen;
- datos legales verificables: razón social, domicilio, regulación/licencias aplicables, términos y privacidad;
- acceso a Google Search Console.

Si alguna dependencia no está disponible, se continúa con el resto del sprint y se deja esa tarea marcada como bloqueada, sin inventar información.

---

## Sprint 0 — Preparación y línea base

Duración: medio día.

### Tareas

- Crear una rama `codex/seo-foundation`.
- Guardar las mediciones Lighthouse actuales como baseline.
- Registrar una muestra fija de URLs:
  - `/pr`, `/es`, `/en`;
  - blog y FAQ por idioma;
  - un artículo real;
  - `/dashboard`, login y registro;
  - una URL inexistente.
- Crear pruebas automatizadas para status HTTP, idioma, title, canonical, hreflang, robots, JSON-LD y número de `h1`.
- Confirmar qué tags de marketing son realmente necesarios.

### Salida

- baseline reproducible;
- checklist de URLs;
- inventario aprobado de tags y accesos.

### Criterio de cierre

Las pruebas fallan por los problemas conocidos y pueden ejecutarse localmente y contra staging.

---

## Sprint 1 — Rendimiento y carga inicial

Duración: días 1–4.

### 1. Banner LCP

- Generar variantes AVIF/WebP de 480, 760, 1024 y 1440 px.
- Añadir `srcset` y corregir `sizes`.
- Evitar que se descarguen el banner local y el remoto a tamaño completo.
- Servir la variante móvil por debajo de 120 KiB como objetivo.
- Aplicar caché larga al banner versionado.

Archivos principales:

- `src/modules/home/presentation/sections/HomeHeroBanner.vue`
- `public/assets/images/banner/`
- endpoint/CDN de `apibras.finzeler.com`

### 2. Chatbot

- Reemplazar `public/assets/projects/bot.gif` por WebM/MP4 o WebP animado optimizado.
- Cargar el widget después de interacción, consentimiento o cuando el navegador esté ocioso.
- Mantener un botón estático y accesible antes de cargar el chat.

### 3. Analytics y marketing

- Centralizar GA4, Ads y Meta dentro de GTM.
- Eliminar la carga directa duplicada de `gtag.js` en `index.html` si GTM ya la realiza.
- Retrasar tags no esenciales hasta consentimiento.
- Validar que los eventos de conversión sigan llegando una sola vez.

### 4. Bundle y CSS

- Analizar el bundle principal.
- Evitar imports globales de módulos exclusivos del dashboard.
- Dividir chatbot, calculadora avanzada y dependencias de rutas privadas.
- Extraer solo el CSS crítico del primer viewport si la ganancia justifica la complejidad.

### Criterios de cierre

- transferencia móvil < 2 MiB;
- una sola descarga del banner;
- banner LCP < 150 KiB en viewport móvil;
- chat < 200 KiB antes de interacción, idealmente 0;
- no hay pageviews o conversiones duplicadas;
- Lighthouse móvil mediano de tres ejecuciones: Performance ≥ 80 y LCP < 2.5 s.

---

## Sprint 2 — Indexación, HTML y arquitectura técnica

Duración: días 5–10.

### 1. Prerender/SSG

- Generar HTML para `/pr`, `/es`, `/en`, blog y FAQ.
- Generar detalles de blog publicados desde la API.
- Mantener `/dashboard` y sus hijos fuera del prerender público.
- Asegurar que el contenido útil, encabezados y enlaces estén en el HTML inicial.

### 2. Metadatos

- Hacer que cada HTML incluya antes de JavaScript:
  - `lang` correcto;
  - title y description únicos;
  - canonical absoluto y sin query/hash;
  - hreflang recíproco;
  - Open Graph y Twitter con imágenes absolutas;
  - robots correcto.
- Corregir la portada para tener un solo `h1`.
- Cambiar el título de la calculadora a `h2` y reparar saltos de jerarquía.

Archivos principales:

- `src/interface/presentation/composables/useSeo.ts`
- `src/interface/router/index.ts`
- `src/modules/home/presentation/bodies/HomepageView.vue`
- `src/modules/calculator/presentation/bodies/CalculatorView.vue`
- vistas de blog y FAQ

### 3. Status HTTP y seguridad de indexación

- Añadir vista 404 en Vue.
- Configurar Nginx para devolver 404 real a rutas inexistentes.
- No aplicar fallback SPA a archivos con extensión ni a rutas especiales inexistentes.
- Entregar `X-Robots-Tag: noindex, nofollow` en áreas privadas cuando corresponda.
- Definir el comportamiento de `/`: landing `x-default` estable o redirección HTTP acordada.

### 4. Sitemap

- Generarlo durante build/deploy desde rutas públicas y artículos publicados.
- Incluir cada URL de idioma como `<loc>`.
- Añadir alternates recíprocos y `lastmod` real.
- Excluir login, registro, dashboard, filtros, búsquedas y borradores.

### Criterios de cierre

- `curl` sobre cada URL pública devuelve contenido localizado y metadatos completos;
- `/esto-no-existe` devuelve 404;
- dashboard/login/registro no son indexables;
- ninguna canonical contiene UTM, query o hash;
- sitemap contiene el 100% de las páginas públicas publicadas;
- no hay errores de hreflang en las pruebas.

---

## Sprint 3 — Schema, confianza, accesibilidad y lanzamiento

Duración: días 11–15.

### 1. Datos estructurados

- Portada: `Organization` y `WebSite`.
- Páginas de servicio: `Service`.
- Artículos: `BlogPosting`.
- Navegación: `BreadcrumbList`.
- FAQ visible: `FAQPage` como descripción semántica, sin asumir que Google mostrará rich results.
- Validar todos los bloques con Schema Markup Validator y Rich Results Test cuando aplique.

Los datos legales y regulatorios deben provenir del negocio; no se inventan licencias, ratings ni direcciones.

### 2. E-E-A-T para servicios financieros

- Publicar páginas de “Quiénes somos”, contacto, términos, privacidad, reclamaciones y seguridad.
- Mostrar razón social, jurisdicción y autorizaciones aplicables.
- Añadir autor, revisor, fuentes, fecha de publicación y actualización al blog.
- Crear bloques claros sobre costos, tiempos, requisitos y funcionamiento.

### 3. Accesibilidad

- Corregir contraste.
- Aumentar objetivos táctiles pequeños.
- Validar foco visible, etiquetas y orden de headings.
- Repetir Lighthouse Accessibility hasta ≥ 95.

### 4. Cabeceras y archivos reales

- Configurar HSTS, CSP, `X-Content-Type-Options` y `Referrer-Policy`.
- Ocultar la versión de Nginx.
- Crear favicon y manifest reales.
- Publicar `security.txt` y `llms.txt` solo si contienen información válida; en caso contrario devolver 404.

### 5. QA y despliegue

- Desplegar primero en staging.
- Ejecutar build, pruebas SEO, Lighthouse móvil/escritorio y revisión visual.
- Hacer smoke test de calculadora, login, transferencias, idiomas, analytics y blog.
- Desplegar producción.
- Enviar sitemap y solicitar validación de páginas clave en Search Console.

### Criterios de cierre

- build y pruebas pasan;
- no hay regresiones en calculadora, autenticación o transferencias;
- Schema sin errores;
- Accessibility ≥ 95;
- Lighthouse móvil ≥ 80 en la mediana de tres corridas;
- Search Console reconoce el sitemap;
- baseline y resultados finales quedan documentados.

---

## Backlog posterior — crecimiento orgánico

Estas tareas comienzan después de estabilizar la base técnica:

- páginas por corredor: Brasil → Perú y Perú → Brasil;
- páginas sobre USD, tasas, comisiones, tiempos, requisitos y seguridad;
- calendario editorial de 2–4 contenidos útiles por mes;
- enlazado interno entre servicios, FAQ y artículos;
- análisis de competidores, keywords y backlinks con datos reales;
- seguimiento de menciones/citas en buscadores con IA.

## Tablero de ejecución

Estado actualizado el 8 de julio de 2026 (rama `acastillo`). El detalle está en
[SEO-IMPLEMENTATION-STATUS.md](SEO-IMPLEMENTATION-STATUS.md).

| ID | Entregable | Sprint | Dependencia | Estado |
|---|---|---:|---|---|
| SEO-01 | Baseline y pruebas automáticas | 0 | Ninguna | Parcial — baseline capturado (SUMMARY.json/informes); faltan pruebas automáticas |
| PERF-01 | Banner responsive y cacheado | 1 | API/CDN | Hecho (local) — variantes 480/768/1152 + srcset; falta que el backend sirva el banner remoto redimensionado |
| PERF-02 | Chat optimizado y diferido | 1 | Ninguna | Hecho — launcher 1.35 MB → 56 KB (WebP animado); ya diferido a idle |
| PERF-03 | Tags de marketing consolidados | 1 | Acceso GTM | Bloqueado — no se puede deduplicar gtag/GTM sin ver el contenedor GTM |
| PERF-04 | Bundle/CSS reducido | 1 | PERF-03 | Hecho — manualChunks; entry principal 285 KB → 81 KB |
| TECH-01 | Prerender/SSG público | 2 | API de blog | Pendiente — decisión de arquitectura (SSG/SSR); alto riesgo, sin abordar en esta tanda |
| TECH-02 | Metadatos estáticos localizados | 2 | TECH-01 | Parcial — canonical sin query/hash, hreflang limpio, h1 único; el HTML por idioma pre-JS depende de TECH-01 |
| TECH-03 | 404/noindex/hosting | 2 | Acceso hosting (Apache) | Hecho — vista 404 Vue (noindex) + .htaccess devuelve 404 real a archivos inexistentes + X-Robots-Tag noindex en /dashboard |
| TECH-04 | Sitemap automático | 2 | API de blog | Hecho — 9 URLs por idioma con alternates + `lastmod`; script incluye artículos cuando la API responde |
| DATA-01 | JSON-LD por tipo de página | 3 | TECH-01, datos legales | Hecho — Organization+WebSite (estático), FAQPage, BlogPosting, BreadcrumbList |
| TRUST-01 | Páginas legales y E-E-A-T | 3 | Contenido legal | Bloqueado — requiere contenido legal/regulatorio verificable del negocio |
| A11Y-01 | Contraste, headings y targets | 3 | Sprint 2 | Parcial — jerarquía de headings corregida; contraste/targets requieren Lighthouse + decisiones de diseño |
| OPS-01 | Cabeceras y archivos especiales | 3 | Acceso hosting (Apache) | Hecho — HSTS, Permissions-Policy, CSP (Report-Only), ServerSignature Off, favicon + site.webmanifest |
| QA-01 | Regresión, Lighthouse y despliegue | 3 | Todos | Parcial — build + typecheck OK, verificación en preview OK; Lighthouse/staging/producción son externos |

## Regla de finalización

Una tarea no está terminada solo porque el código compile. Debe cumplir su criterio verificable en staging, tener prueba de regresión cuando corresponda y conservar las funciones comerciales existentes.
