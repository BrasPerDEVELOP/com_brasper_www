# Web de prueba en /promocion/

- Rama: `staging`. La portada principal continúa desplegada desde `main`.
- URL: `https://brasper.com/promocion/` (idiomas `/es/`, `/en/`, `/br/`).
- API: `https://apibras.finzeler.com`, la misma de producción.
- Checkout: `/var/www/com_brasper_www_staging`.
- Releases: `/var/www/releases/brasper-www-staging`.
- `current` apunta al `dist` activo; `promocion` es un enlace relativo a `current`.

## Imágenes y cupones

Los originales proporcionados por el usuario se publican sin recorte en
`public/assets/images/promocion/{es,en,pr}.png`. En modo `staging` se muestra
la imagen correspondiente al idioma en lugar del banner del CMS. No se modifica
el banner compartido en la API ni la portada principal.

No hay un cupón fijo ni un descuento calculado específicamente para la prueba:
la calculadora consume `/transactions/coupons/automatic`, con las condiciones
y porcentajes que devuelve la API. Las imágenes anuncian una promoción, pero
no crean un cupón ni alteran las condiciones del backend.

## Compilar y desplegar

```bash
pnpm run build:staging
git push origin staging
```

El build verifica TypeScript, rutas API, prefijo `/promocion/`, imágenes por idioma,
metadatos noindex y ausencia del antiguo cupón fijo en el JavaScript compilado.

En el servidor:

```bash
git -C /var/www/com_brasper_www_staging pull --ff-only origin staging
bash /var/www/com_brasper_www_staging/scripts/deploy-staging.sh
```

El script requiere la rama `staging` limpia, compila en una release independiente
y cambia `current` solo si todo termina correctamente. Reutiliza la configuración
privada del checkout; `.env.staging` fija la API principal. No despliega ni reinicia
la API, la base de datos ni la portada de producción.

## Nginx

`deploy/nginx/promocion.conf` se instala en
`/etc/nginx/snippets/brasper-promocion.conf` y se incluye únicamente en el servidor
HTTPS de `brasper.com` / `www.brasper.com`. Solo añade las rutas `/promocion`
y `/promocion/`; las demás ubicaciones existentes se conservan.

`deploy/nginx/staging-https.conf` mantiene redirecciones temporales desde el antiguo
subdominio hacia la ruta nueva, conservando idioma, ruta y parámetros. El sitio
principal aporta el certificado HTTPS y su origen ya está permitido por la API.
No hacen falta nuevos registros DNS ni cambios de CORS para esta ruta.

Validar siempre con `nginx -t` antes de `systemctl reload nginx`. La ruta de prueba
lleva `X-Robots-Tag: noindex, nofollow, noarchive` y no se añade al sitemap principal.
Al compartir dominio y API, la sesión y los datos son los mismos de producción.

## Recuperación

Se conservan las releases previas y respaldos de Nginx bajo `/root/backups`.
Para volver al subdominio anterior, restaurar conjuntamente su configuración,
la configuración principal y la release compilada para `/`. No usar un build
con base `/promocion/` como si estuviese publicado en `/`.

La API del servidor quedó limpia y sincronizada con `origin/main` el 2026-11-11;
los cambios locales descartados se guardaron en el stash
`before-staging-api-cleanup-20261111`. Su imagen desplegada no se cambió.
