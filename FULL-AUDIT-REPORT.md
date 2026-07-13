# Auditoría SEO de Brasper

Fecha: 8 de julio de 2026  
Sitio: https://brasper.com/  
Proyecto: `com_brasper_www`  
Método: revisión del código Vue/Vite, respuestas HTTP reales, HTML inicial y renderizado, `robots.txt`, sitemap, rutas y Lighthouse 13.4 móvil.

## Resumen ejecutivo

**SEO Health Score estimado: 52/100**

Brasper es un servicio financiero/remesas internacional, multilingüe y orientado principalmente a Brasil y Perú. La web tiene una base útil: HTTPS, `robots.txt`, sitemap, URLs por idioma, textos localizados, enlaces internos, imágenes con `alt`, canonical y hreflang después de ejecutar JavaScript. Sin embargo, el sitio depende casi por completo del renderizado cliente y su carga móvil es lenta.

| Área | Peso | Nota |
|---|---:|---:|
| SEO técnico | 22% | 55 |
| Contenido | 23% | 68 |
| On-page | 20% | 58 |
| Schema | 10% | 10 |
| Rendimiento | 10% | 49 |
| Búsqueda con IA / GEO | 10% | 35 |
| Imágenes | 5% | 60 |

### Cinco problemas prioritarios

1. **HTML inicial genérico para todos los idiomas.** `/es`, `/pr` y `/en` entregan exactamente el mismo documento: `lang="pt-BR"`, `<title>Brasper</title>`, metadatos genéricos, sin canonical ni hreflang y con `#app` vacío. La personalización existe solo después de ejecutar JavaScript.
2. **Rendimiento móvil bajo.** Lighthouse móvil obtuvo 49/100: FCP 9.5 s, LCP 32.0 s, Speed Index 10.6 s, TBT 320 ms y 155 KiB de JavaScript potencialmente innecesario. CLS fue excelente: 0.
3. **El LCP descarga imágenes desproporcionadas.** El banner remoto mide 7796×3763 y pesa 1.59 MB para mostrarse cerca de 665×377. Lighthouse estimó 4.15 MB de ahorro total en imágenes. El GIF del chat pesa 1.35 MB.
4. **Soft 404.** Una ruta inventada como `/esto-no-existe` responde `200` y devuelve la SPA. Lo mismo ocurre con `/llms.txt`, `/.well-known/security.txt`, `/site.webmanifest` y `/favicon.ico`: parecen existir para un crawler, pero en realidad devuelven HTML.
5. **No se detectó Schema.org/JSON-LD.** Faltan entidades básicas como `Organization`/`FinancialService`, `WebSite`, `FAQPage`, `BlogPosting` y `BreadcrumbList`.

### Cinco quick wins

1. Generar banners de 760/1024 px y entregar `srcset`; convertir el GIF del chat a WebM/MP4 o WebP animado.
2. Eliminar la doble carga de medición: el HTML incluye GTM y además `gtag.js`; el contenedor carga más tags de Google, Ads y Facebook.
3. Dejar un solo `h1` en portada: actualmente el hero y la calculadora generan dos.
4. Añadir todos los artículos publicados al sitemap y automatizar su generación desde la API.
5. Configurar Nginx para devolver 404 reales y servir únicamente archivos existentes en rutas como `/llms.txt` o `/favicon.ico`.

## Hallazgos técnicos

### Renderizado e indexabilidad — crítico

El código usa `useSeo()` para modificar `<head>` en el navegador. Después de renderizar, `/pr` sí contiene canonical y alternates correctos, pero la respuesta HTTP original no. Esto perjudica especialmente:

- previews de WhatsApp, Facebook y otras plataformas que no ejecutan JavaScript;
- rastreadores con presupuesto limitado;
- páginas de blog, cuyo título, descripción, imagen y cuerpo dependen de una llamada posterior a la API;
- consistencia entre idioma solicitado y señales recibidas.

La solución recomendada es prerender/SSG para las páginas públicas (`/es`, `/en`, `/pr`, blog y FAQ), o SSR si el contenido cambia con mucha frecuencia. El HTML generado debe contener contenido visible, título, descripción, canonical, hreflang, Open Graph y JSON-LD antes de JavaScript.

### Rutas y códigos HTTP — crítico

- `/` devuelve `200` y redirige en el cliente según preferencias; debería usar una decisión estable y rastreable, o ser una landing `x-default`.
- Las rutas inexistentes devuelven `200`, creando soft 404 e indexación basura.
- `/dashboard` también responde con HTML indexable antes de que el cliente compruebe autenticación.
- El `robots` declarado en el meta de las rutas `auth` y `register` no se consume automáticamente; depende de que cada vista lo pase a `useSeo`.
- Faltan cabeceras observables como HSTS y una política de seguridad de contenido. El servidor expone `Server: nginx/1.24.0 (Ubuntu)`.

### Sitemap y hreflang — alto

El sitemap es válido y contiene tres grupos: portada, blog y FAQ. Cada grupo declara `pt-BR`, `es-PE`, `en-US` y `x-default`, lo cual es una buena base.

Problemas:

- solo la URL portuguesa aparece como `<loc>`; es preferible incluir cada URL indexable como entrada completa con alternates recíprocos;
- no aparecen los artículos individuales;
- no hay `lastmod`;
- la ruta usa `/pr` para portugués; no es inválido, pero `/pt` sería semánticamente más reconocible. Cambiarla solo conviene con redirecciones 301 y un plan de migración.

### Canonical e idioma — alto

El canonical se construye con `route.fullPath`, por lo que conserva query strings y hashes. Filtros, parámetros de campaña o búsquedas podrían crear canonicals fragmentados. Debe construirse con el `path` normalizado y sin parámetros no canónicos.

La respuesta inicial siempre declara portugués, incluso en `/es` y `/en`. El idioma correcto aparece tras ejecutar Vue.

### Rendimiento y Core Web Vitals — crítico

Resultados de laboratorio móvil en producción:

| Métrica | Resultado | Objetivo |
|---|---:|---:|
| Performance | 49/100 | ≥ 90 |
| FCP | 9.5 s | ≤ 1.8 s |
| LCP | 32.0 s | ≤ 2.5 s |
| TBT | 320 ms | ≤ 200 ms |
| Speed Index | 10.6 s | ≤ 3.4 s |
| CLS | 0 | ≤ 0.1 |

El servidor raíz respondió en unos 200 ms durante Lighthouse, por lo que el mayor problema está en recursos y renderizado. El banner remoto de API es el LCP. Además, se solicita primero el banner local grande y luego se reemplaza con otro banner remoto aún mayor, duplicando trabajo. GTM, Google Analytics/Ads y Meta añaden múltiples scripts.

No se obtuvo CrUX/field data: la API pública de PageSpeed respondió por cuota agotada. Estos resultados son de laboratorio y deben contrastarse con Search Console.

## On-page y contenido

### Fortalezas

- títulos y descripciones traducidos existen en el código;
- portada, blog y FAQ tienen URLs localizadas;
- los artículos usan un `h1` visible y `alt` descriptivo;
- hay contenido explicativo, FAQ, señales de aliados y datos de contacto;
- la mayoría de imágenes relevantes usa dimensiones, lazy loading o texto alternativo.

### Oportunidades

- Producción mantuvo el título renderizado como “Brasper” durante la prueba, aunque la descripción sí cambió; hay que verificar la reactividad/versión desplegada.
- La portada contiene dos `h1`: el mensaje principal y “Seu envio em minutos” dentro de la calculadora. El segundo debería ser `h2`.
- Lighthouse detectó saltos en la jerarquía de encabezados.
- El contenido financiero necesita señales E-E-A-T más fuertes: razón social, jurisdicción, autorizaciones/licencias aplicables, responsables, política editorial, autores y revisores, fechas de actualización y fuentes.
- La página de blog depende de la API y no expone artículos en el HTML inicial.
- Las páginas públicas son pocas para cubrir intención orgánica. Faltan páginas específicas y sustanciales sobre corredores Brasil–Perú, Perú–Brasil, USD, costos, tiempos, requisitos y seguridad.

## Datos estructurados

No se encontró JSON-LD en el código ni en el HTML renderizado. Implementar, solo con información verificable:

- portada: `Organization` o el subtipo más preciso permitido, `WebSite` y datos de contacto;
- FAQ: `FAQPage` si las preguntas y respuestas están visibles;
- artículos: `BlogPosting` con autor, fechas, imagen y publisher;
- navegación interna: `BreadcrumbList`;
- perfiles sociales: `sameAs`;
- idioma y mercado: `inLanguage` y `areaServed`.

No declarar premios, licencias, ratings ni servicios que no puedan demostrarse.

## Imágenes

Hallazgos principales de Lighthouse:

- banner remoto: 1,588,154 bytes; ahorro estimado 1,574,578 bytes;
- GIF del chat: 1,354,385 bytes; ahorro estimado 1,350,216 bytes;
- banner local: 842,246 bytes; ahorro estimado 832,715 bytes;
- logos bancarios sobredimensionados y algunos PNG convertibles a WebP/AVIF.

El `sizes` del banner dice 380 px en escritorio, pero el recurso no ofrece `srcset`; el navegador no puede elegir una variante pequeña. La API debería entregar variantes transformadas.

## Accesibilidad y experiencia

Lighthouse obtuvo 92/100. Fallaron:

- contraste de algunos textos/fondos;
- orden de encabezados;
- tamaño o separación de ciertos objetivos táctiles.

Estas mejoras también ayudan a la experiencia de búsqueda y conversión.

## Preparación para búsqueda con IA

No existe un `/llms.txt` real; actualmente la ruta devuelve la SPA con código 200. Más importante que ese archivo es ofrecer HTML prerenderizado, respuestas directas, políticas y datos empresariales verificables. Para mejorar citabilidad:

- incluir bloques concisos de “coste”, “tiempo”, “requisitos” y “cómo funciona”;
- identificar claramente la entidad Brasper y mercados atendidos;
- publicar autores, revisores y fecha de actualización;
- usar tablas y FAQ visibles;
- enlazar políticas, términos, privacidad, reclamaciones y documentación regulatoria.

## Limitaciones

- No se usaron datos privados de Google Search Console, GA4 ni Google Business Profile.
- No se evaluaron rankings, volumen de palabras clave ni backlinks.
- La API de PageSpeed no entregó datos de campo por cuota; se usó Lighthouse local contra producción.
- El blog dinámico no estaba enumerado en el sitemap, por lo que no se pudo auditar un inventario completo de artículos.
