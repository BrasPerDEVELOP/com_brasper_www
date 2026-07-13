# Validación SEO preproducción — demo.brasper.online

Fecha: 8 de julio de 2026  
URL solicitada: https://demo.brasper.online/pr  
Comparación: https://brasper.com/es y https://brasper.com/pr  
Herramientas: codex-seo 1.9.6, Lighthouse 13.4.0, recolector HTTP seguro y Chrome headless.

## Veredicto

**Release gate: BLOQUEADO**

Las correcciones de rendimiento son reales y sustanciales, pero las rutas públicas válidas responden 404 en el servidor demo:

- `/pr`: 404
- `/es`: 404
- `/en`: 404
- `/pr/blog`: 404
- `/pr/faq`: 404
- `/pr/auth`: 404
- `/pr/register`: 404
- `/dashboard`: 404

La raíz `/` responde 200 y monta la aplicación, pero el DOM termina declarando canonical `https://demo.brasper.online/pr`, una URL que devuelve 404. Lighthouse no pudo auditar `/pr` y produjo `ERRORED_DOCUMENT_REQUEST`.

No se debe publicar esta configuración en `brasper.com` hasta resolver el fallback de rutas válidas.

## Comparación de rendimiento

Los datos son de laboratorio. La comparación móvil usa la auditoría anterior de `/es` y la raíz demo, que carga la portada portuguesa.

| Métrica | Producción anterior móvil | Demo móvil | Cambio |
|---|---:|---:|---:|
| Performance | 55 | 78 | +23 |
| FCP | 6.9 s | 3.8 s | -3.1 s |
| LCP | 26.9 s | 3.8 s | -23.1 s |
| Speed Index | 12.0 s | 4.1 s | -7.9 s |
| TBT | 120 ms | 120 ms | Igual |
| CLS | 0.0003 | 0.001 | Sigue bueno |
| Transferencia | 6.56 MiB | 4.22 MiB | -2.34 MiB |
| Solicitudes | 70 | 74 | +4 |

| Métrica | Producción anterior escritorio | Demo escritorio | Cambio |
|---|---:|---:|---:|
| Performance | 57 | 78 | +21 |
| FCP | 2.9 s | 1.0 s | -1.9 s |
| LCP | 6.7 s | 3.3 s | -3.4 s |
| Speed Index | 4.5 s | 1.6 s | -2.9 s |
| TBT | 0 ms | 0 ms | Igual |
| CLS | 0.0012 | 0.001 | Sigue bueno |
| Transferencia | 6.86 MiB | 4.55 MiB | -2.31 MiB |
| Solicitudes | 68 | 70 | +2 |

## Correcciones confirmadas

### Rendimiento

- La puntuación móvil subió 23 puntos.
- El LCP móvil bajó de 26.9 s a 3.8 s.
- El GIF de chatbot de 1.29 MiB ya no aparece entre los recursos descargados.
- El banner local pesado dejó de aparecer entre los recursos principales.
- La transferencia total móvil bajó aproximadamente 36%.
- CLS continúa muy cerca de cero.

### SEO y semántica

- La portada renderizada ahora tiene un solo `h1`.
- El título de la calculadora pasó a `h2`.
- Se añadió JSON-LD estático con `Organization` y `WebSite`.
- El sitemap incluye las tres variantes de idioma como `<loc>` y añade `lastmod`.
- Se añadió un `site.webmanifest`.
- Las URLs inexistentes ahora responden 404 real.

## Bloqueadores críticos

### 1. Las rutas válidas también devuelven 404

La regla del servidor corrigió los soft 404, pero eliminó el fallback necesario para Vue Router. El servidor solo entrega la SPA en `/`.

Configuración esperada:

- rutas públicas conocidas y rutas internas de la SPA deben servir `index.html`;
- archivos inexistentes con extensión y rutas no reconocidas deben responder 404;
- idealmente las rutas públicas prerenderizadas deben existir como HTML físico;
- la aplicación debe incluir una ruta catch-all para mostrar una página 404;
- el servidor debe distinguir rutas válidas de rutas inventadas.

Hasta implementar prerender, una solución transitoria en LiteSpeed/Apache debe reescribir exclusivamente las rutas Vue conocidas a `index.html`. No usar un fallback universal, porque reintroduciría soft 404.

### 2. Canonical y hreflang apuntan a páginas 404

Desde `/`, Vue genera:

- canonical: `https://demo.brasper.online/pr`;
- alternates: `/pr`, `/es`, `/en`.

Todas responden 404. Esto convierte una mejora correcta de metadatos en una señal inválida.

### 3. HTML inicial todavía es una SPA vacía y genérica

La respuesta inicial de `/` conserva:

- `<html lang="pt-BR">`;
- `<title>Brasper</title>`;
- `#app` sin contenido visible;
- sin canonical ni hreflang estáticos.

El JSON-LD sí está presente en el HTML inicial, pero title, contenido, canonical y hreflang siguen dependiendo de JavaScript. El prerender/SSG aún no está implementado o no fue desplegado.

### 4. El banner remoto sigue siendo el recurso dominante

El banner de `apibras.finzeler.com` pesa aproximadamente 1.59 MB y continúa siendo el recurso más grande. En el DOM aparece `srcset=""`, por lo que la variante responsive no está funcionando para el banner remoto.

Lighthouse estima:

- 2.11 MiB de ahorro en imágenes en móvil;
- 3.39 MiB de ahorro en imágenes en escritorio.

Objetivo pendiente: banner móvil menor de 120–150 KiB y LCP menor de 2.5 s.

### 5. Analytics continúa duplicado

La carga móvil incluye:

- GTM;
- varias instancias de `gtag.js`;
- identificadores de GA4 y Google Ads.

Lighthouse estima 246 KiB de JavaScript no usado en móvil y 320 KiB en escritorio. Las solicitudes totales aumentaron.

## Otros hallazgos

### Sitemap y robots

El sitemap demo apunta correctamente al dominio canónico de producción `brasper.com`, pero `robots.txt` también anuncia el sitemap de producción. Esto puede ser intencional para un artefacto listo para desplegar.

Mientras el entorno siga público, conviene protegerlo con autenticación o `noindex` global para evitar que el demo compita con producción.

El sitemap todavía no mostró artículos individuales del blog; solo portada, listado y FAQ.

### Schema

El JSON-LD contiene `Organization` y `WebSite`, con IDs y URLs de producción. Es adecuado para un build destinado a producción. Deben validarse:

- teléfono y datos legales;
- URL final del logo;
- codificación UTF-8 del archivo servido;
- schema específico de artículos y breadcrumbs.

El texto apareció con mojibake (`PerÃº`) en la lectura HTTP del manifest y JSON-LD, aunque Chrome lo corrigió al renderizar. Debe enviarse un `charset=utf-8` explícito para JSON/manifest/texto.

### Manifest y archivos especiales

- `site.webmanifest`: 200, pero se sirve como `text/plain`; debería usar `application/manifest+json`.
- `favicon.ico`: 404.
- `security.txt`: 404.
- `llms.txt`: 404 real, comportamiento correcto si todavía no existe.

### Accesibilidad

La raíz demo obtuvo 89/100, menor que el 92 anterior. Persisten:

- contraste insuficiente;
- jerarquía de headings;
- enlaces distinguibles solo por color;
- objetivos táctiles pequeños.

### Buenas prácticas

La puntuación fue 77/100. Lighthouse detectó cookies de terceros e incidencias en DevTools.

## SEO drift: antes vs. demo

### Mejoras

- nuevo schema estático;
- un solo `h1`;
- sitemap expandido;
- manifest añadido;
- 404 reales;
- reducción fuerte de LCP y transferencia.

### Regresiones

- rutas públicas válidas pasaron de 200 a 404;
- canonical y hreflang terminan apuntando a 404;
- Accessibility bajó;
- aumentó el número de solicitudes.

### Sin resolver

- HTML inicial sin contenido prerenderizado;
- title genérico;
- banner remoto sobredimensionado;
- tags de medición duplicados;
- artículos ausentes del sitemap;
- metadatos localizados dependientes de JavaScript.

## Limitaciones

- Lighthouse no pudo medir `/pr` porque el documento devuelve 404; se midió `/` para validar el rendimiento del bundle desplegado.
- No se usaron datos de campo de CrUX, Search Console o GA4.
- No se validaron artículos individuales porque las rutas de blog no son accesibles.
