# Plan de corrección para aprobar el demo

## P0 — antes de cualquier despliegue

### 1. Restaurar rutas válidas

- Hacer que `/pr`, `/es`, `/en`, blog y FAQ respondan 200.
- Mantener 404 para rutas inventadas y archivos inexistentes.
- Confirmar si Hostinger usa `.htaccess`/LiteSpeed y aplicar reglas explícitas.
- Probar también refresh directo y apertura en pestaña nueva.

Aceptación:

- `/pr`, `/es`, `/en`, `/pr/blog` y `/pr/faq`: 200;
- `/esto-no-existe`: 404;
- Lighthouse puede cargar `/pr`;
- canonical y cada hreflang responden 200.

### 2. Bloquear indexación del demo

- Añadir autenticación HTTP, o como mínimo `X-Robots-Tag: noindex, nofollow`.
- No enviar el sitemap demo a Search Console.

Aceptación:

- el entorno demo no puede competir con `brasper.com`;
- el build de producción no hereda el `noindex`.

## P1 — completar las correcciones técnicas

### 3. Implementar prerender/SSG

- Generar HTML físico para portada, FAQ y blog por idioma.
- Incluir contenido, lang, title, description, canonical, hreflang, OG y schema en la respuesta inicial.
- Generar artículos publicados durante build o usar SSR para el detalle.

Aceptación:

- `fetch_page.py` encuentra un `h1`, contenido y metadatos sin ejecutar JavaScript;
- `/es` entrega español y `/en` inglés desde el primer byte.

### 4. Terminar el banner responsive

- Hacer que el backend/CDN entregue variantes reales.
- No dejar `srcset=""`.
- Limitar la variante móvil a 120–150 KiB.
- Añadir caché larga al recurso versionado.

Aceptación:

- LCP móvil < 2.5 s;
- transferencia móvil < 2 MiB;
- ahorro potencial de imágenes < 300 KiB.

### 5. Consolidar medición

- Gestionar GA4, Ads y Meta desde una sola estrategia GTM.
- Eliminar cargas duplicadas de `gtag.js`.
- Diferir marketing hasta consentimiento cuando corresponda.

Aceptación:

- un solo pageview por navegación;
- sin conversiones duplicadas;
- solicitudes móviles por debajo de la baseline anterior.

## P2 — cierre de calidad

- Añadir artículos publicados al sitemap con `lastmod` real.
- Servir manifest como `application/manifest+json; charset=utf-8`.
- Añadir favicon real.
- Corregir contraste, enlaces por color, targets y headings.
- Validar JSON-LD.
- Repetir Lighthouse tres veces por perfil y usar la mediana.

## Criterio final de aprobación

- todas las rutas canónicas responden 200;
- rutas desconocidas responden 404;
- demo está protegido de indexación;
- HTML público es prerenderizado y localizado;
- Lighthouse móvil ≥ 80;
- LCP móvil < 2.5 s;
- transferencia móvil < 2 MiB;
- Accessibility ≥ 95;
- sitemap, schema, canonical y hreflang pasan validación;
- calculadora, idiomas, blog, login y dashboard superan smoke tests.
