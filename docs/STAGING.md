# Staging de la web

- Rama: `staging`. Producción continúa en `main`.
- Host: `staging.brasper.com`.
- API: `https://apibras.finzeler.com`, la misma de producción.
- Checkout separado: `/var/www/com_brasper_www_staging`.
- Releases: `/var/www/releases/brasper-www-staging`; `current` apunta al `dist` activo.

## Cupón

En un build con modo `staging`, servido exactamente desde `staging.brasper.com`,
la calculadora muestra `MARINA25` en lugar del código del cupón automático recibido.
Conserva el ID, porcentaje, monedas, fechas y condiciones de la API. El nombre
no implica un 25 % de descuento. Si no existe un cupón vigente para un par,
no se inventa uno. No se crea ni modifica ningún cupón en la base de datos.
El mensaje de cotización de WhatsApp usa el código mostrado.

## Compilar y desplegar

```bash
pnpm run test:staging
pnpm run build:staging
git push origin staging
```

En el servidor (el script selecciona las instalaciones existentes de Node y pnpm):

```bash
bash /var/www/com_brasper_www_staging/scripts/deploy-staging.sh
```

El script solo acepta el checkout de staging, exige un árbol limpio, actualiza
por fast-forward, instala dependencias en una release independiente y compila
antes de cambiar el enlace activo. No reinicia la API ni modifica producción.
La primera vez se copia el `.env` de la web de producción al checkout de staging
con permisos 600; `.env.staging` fija el dominio de la API al compilar.

## DNS, HTTPS y acceso a la API

1. Crear en Hostinger un registro A `staging` → `167.86.97.146` (TTL 300).
2. Instalar `deploy/nginx/staging-http.conf` como sitio `brasper_staging` y validar
   con `nginx -t` antes de una recarga gradual de Nginx.
3. Con DNS propagado, emitir un certificado independiente:
   `certbot certonly --webroot -w /var/www/letsencrypt -d staging.brasper.com --non-interactive`.
4. Reemplazar únicamente el sitio de staging con `staging-https.conf`, ejecutar
   `nginx -t` y `systemctl reload nginx`.
5. Agregar `https://staging.brasper.com` a `CORS_ALLOWED_ORIGINS` del servicio API
   preservando los orígenes existentes. Es necesario también para la validación
   de origen del refresh de sesión. Revisar la configuración efectiva y la imagen
   desplegada antes de recrear exclusivamente el contenedor API sin build.
6. Verificar HTTPS, GET y preflight con origen staging; comprobar que los orígenes
   de producción siguen funcionando y un origen ajeno sigue rechazado.

Hasta completar DNS, HTTPS y CORS, el entorno no está listo para uso público.
Staging lleva cabecera `X-Robots-Tag` y robots.txt que desaconsejan indexarlo.
Al compartir API, las operaciones de cuentas y transacciones usan datos reales.

## Volver a una release anterior

Elegir un `dist` verificado dentro de `/var/www/releases/brasper-www-staging`:

```bash
ln -s /var/www/releases/brasper-www-staging/RELEASE_ANTERIOR/dist /var/www/com_brasper_www_staging/current.next
mv -Tf /var/www/com_brasper_www_staging/current.next /var/www/com_brasper_www_staging/current
```

La web principal y sus enlaces de releases permanecen separados.
