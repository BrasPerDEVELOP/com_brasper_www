/**
 * Genera las variantes responsive del banner de la portada.
 *
 * Lee los originales de `src/assets/images/banner/{es,en,pr}.webp` (no se despliegan)
 * y escribe `public/assets/images/banner/{loc}-{480,768,1152}.webp`, que son las que
 * consume `HomeHeroBanner.vue` vía `srcset`.
 *
 * Requiere `cwebp` (libwebp) en el PATH:  brew install webp
 * Uso:  npx tsx scripts/generate-banners.ts
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LOCALES = ['es', 'en', 'pr'] as const
const WIDTHS = [480, 768, 1152] as const
const QUALITY = 72

const SRC_DIR = resolve(ROOT, 'src/assets/images/banner')
const OUT_DIR = resolve(ROOT, 'public/assets/images/banner')

function main(): void {
  mkdirSync(OUT_DIR, { recursive: true })

  for (const locale of LOCALES) {
    const src = resolve(SRC_DIR, `${locale}.webp`)
    if (!existsSync(src)) {
      console.warn(`[banners] Falta el original ${src}; se omite ${locale}.`)
      continue
    }
    for (const width of WIDTHS) {
      const out = resolve(OUT_DIR, `${locale}-${width}.webp`)
      execFileSync('cwebp', ['-quiet', '-q', String(QUALITY), '-resize', String(width), '0', src, '-o', out])
      console.log(`[banners] ${locale}-${width}.webp`)
    }
  }
  console.log('[banners] Listo.')
}

main()
