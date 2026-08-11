import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = new URL('../', import.meta.url).pathname
// `scripts/` entra en el alcance porque los generadores de build (sitemap,
// prerender) también llaman al API. Estaban fuera, y por eso pasó inadvertido un
// `/blog/?page_size=100` que habría dejado el sitemap sin artículos en silencio
// al retirar los alias legacy.
const scannedRoots = ['src', 'scripts'].map((dir) => join(projectRoot, dir))
const sourceExtensions = new Set(['.ts', '.vue', '.mjs'])
const forbidden = [
  /Domain\.apiPath\(\s*(['"`])[^'"`\n]*\/\1\s*\)/g,
  /new\s+Adapter(?:<[^>]+>)?\(\s*(['"`])[^'"`\n]*\/\1/g,
  /apiClient\.(?:get|post|put|patch|delete)(?:<[^>]+>)?\(\s*(['"`])[^'"`\n]*\/\1/g,
  /const\s+[A-Z0-9_]*(?:API|ENDPOINT)[A-Z0-9_]*\s*=\s*(['"`])[^'"`\n]*\/\1/g,
  // Plantillas contra la base del API: `${API_BASE}/blog/` o `${API_BASE}/blog/?x=1`
  /\$\{[A-Za-z_$][\w$.()]*\}\/[A-Za-z0-9/_-]*\/(?=[`?#])/g
]

function files(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry)
    return statSync(fullPath).isDirectory() ? files(fullPath) : [fullPath]
  })
}

const violations = []
// Este fichero queda fuera: contiene los patrones y sus ejemplos, así que se
// detectaría a sí mismo.
const selfPath = fileURLToPath(import.meta.url)
const scanned = scannedRoots
  .flatMap((dir) => files(dir))
  .filter((item) => sourceExtensions.has(extname(item)) && item !== selfPath)

for (const file of scanned) {
  const content = readFileSync(file, 'utf8')
  for (const pattern of forbidden) {
    pattern.lastIndex = 0
    for (const match of content.matchAll(pattern)) {
      const line = content.slice(0, match.index).split('\n').length
      violations.push(`${relative(projectRoot, file)}:${line}: ${match[0]}`)
    }
  }
}

if (violations.length) {
  console.error('URLs API no canónicas (barra final) detectadas:\n' + violations.join('\n'))
  process.exit(1)
}

console.log('URLs API canónicas: OK')
