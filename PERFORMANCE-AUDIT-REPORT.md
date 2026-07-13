# Auditoría de rendimiento: brasper.com/es

Fecha: 2026-07-08  
Herramienta: Lighthouse 13.4.0  
URL final: https://brasper.com/es

## Resultado

| Métrica | Móvil | Escritorio | Evaluación |
|---|---:|---:|---|
| Performance | 55/100 | 57/100 | Deficiente |
| FCP | 6.9 s | 2.9 s | Deficiente |
| LCP | 26.9 s | 6.7 s | Deficiente |
| Speed Index | 12.0 s | 4.5 s | Deficiente |
| TBT | 120 ms | 0 ms | Bueno |
| CLS | 0.0003 | 0.0012 | Bueno |
| TTI | 27.1 s | 6.7 s | Deficiente |
| Transferencia | 6.56 MiB | 6.86 MiB | Excesiva |
| Solicitudes | 70 | 68 | Mejorable |

Los valores son datos de laboratorio con throttling simulado de Lighthouse. No se obtuvo INP porque esta prueba no incluye datos reales de usuarios; TBT se muestra únicamente como indicador de laboratorio, no como sustituto de INP.

## Hallazgos prioritarios

### 1. Imágenes excesivamente grandes

Lighthouse estima 4.13 MiB de ahorro y hasta 10.35 s de mejora potencial en LCP móvil mediante una entrega de imágenes adecuada.

- La imagen LCP (`banner_es_8433b479.webp`) pesa 1.46 MiB y mide 7796×3763, aunque se muestra aproximadamente a 665×377. Ahorro estimado: 1.45 MiB.
- El GIF del chatbot (`bot.gif`) pesa 1.29 MiB para un elemento cercano a 70×70 CSS px. Ahorro estimado: 1.29 MiB.
- El banner local (`/assets/images/banner/es.webp`) pesa 833 KiB y mide 6251×3016. Ahorro estimado: 824 KiB.
- Las imágenes representan 5.03 MiB de los 6.56 MiB transferidos en móvil.

Acción: generar variantes AVIF/WebP ajustadas a los tamaños renderizados, servirlas con `srcset`/`sizes`, convertir la animación GIF a WebM/MP4 o WebP animado y evitar descargar dos banners de alta resolución.

### 2. LCP muy tardío

El elemento LCP es el banner con texto alternativo “sin demoras ni complicaciones”. Ya usa `loading="eager"` y `fetchpriority="high"`, pero el recurso continúa siendo demasiado pesado. En el desglose registrado, TTFB fue 885 ms, el retraso de solicitud 2.08 s y la descarga 1.52 s.

Acción: mantener la prioridad alta, pero reducir el recurso móvil a dimensiones cercanas a su visualización y servirlo desde el mismo origen o un CDN con caché larga.

### 3. JavaScript innecesario y etiquetas duplicadas

Lighthouse estima 524 KiB de JavaScript sin usar y hasta 2.93 s de ahorro:

- Se descargan varias instancias de `gtag.js`, además de GTM, Google Ads y Facebook Pixel.
- Google Tag Manager transfiere aproximadamente 780 KiB.
- El bundle principal tiene aproximadamente 80 KiB sin usar.

Acción: centralizar Analytics/Ads en una sola carga de GTM, eliminar identificadores o inicializaciones duplicadas, retrasar marketing y chatbot hasta consentimiento/interacción, y dividir el bundle por ruta/componente.

### 4. Caché ineficiente

Lighthouse estima 1.68 MiB de ahorro recurrente. El banner servido desde `apibras.finzeler.com` no presenta una vida útil de caché efectiva.

Acción: aplicar `Cache-Control: public, max-age=31536000, immutable` a archivos versionados y conservar versionado por hash o query estable.

### 5. CSS bloqueante

`/assets/index-DmnfqPuA.css` bloquea el renderizado. Lighthouse estima cerca de 750 ms de mejora y detecta unos 11 KiB de CSS sin usar.

Acción: insertar CSS crítico del primer viewport, diferir el resto y purgar estilos no utilizados.

## Orden recomendado

1. Reprocesar el banner LCP y el GIF del chatbot.
2. Evitar la descarga duplicada de banners y añadir caché larga al banner remoto.
3. Consolidar GTM/gtag y cargar marketing/chat bajo consentimiento o interacción.
4. Dividir JavaScript y CSS por ruta; insertar CSS crítico.
5. Repetir Lighthouse tres veces por perfil y comparar la mediana.

Objetivo inicial razonable: LCP móvil menor de 2.5 s, carga total menor de 2 MiB, CLS menor de 0.1 y score móvil superior a 80.

## Artefactos

Los informes HTML y JSON originales de Lighthouse están en `.seo-cache/lighthouse/` y se excluyen de Git.
