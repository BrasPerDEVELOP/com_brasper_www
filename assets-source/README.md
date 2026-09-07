# assets-source (no se despliega)

Recursos fuente que **no** deben publicarse en producción. No van dentro de `public/`,
así que Vite no los copia a `dist/`.

- `bot.gif` — GIF original del launcher del chat (1.3 MB). En producción se sirve
  `public/assets/projects/bot.webp` (WebP animado, ~56 KB). Regenerar con
  `ffmpeg -i bot.gif -vf scale=160:120 bot-small.gif && gif2webp -q 60 -m 6 -mixed bot-small.gif -o ../public/assets/projects/bot.webp`.

Los originales del banner de portada viven en `src/assets/images/banner/{es,en,pr}.webp`.
Las variantes responsive de `public/assets/images/banner/` se regeneran con
`npm run banners:generate`.
