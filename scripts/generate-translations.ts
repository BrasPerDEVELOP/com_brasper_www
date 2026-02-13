/**
 * Genera src/interface/domain/generated/tr.ts a partir de es.json.
 * Convierte cada clave a camelCase (forgot_password → forgotPassword).
 * Uso: npm run i18n:generate
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const esPath = join(root, 'src/interface/presentation/i18n/es.json')
const outPath = join(root, 'src/interface/domain/generated/tr.ts')

function toCamelCase(key: string): string {
  return key
    .replace(/[._-]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^\w/, (c) => c.toLowerCase())
}

function main() {
  const es = JSON.parse(readFileSync(esPath, 'utf-8')) as Record<string, string>
  const lines: string[] = [
    '// AUTO-GENERATED: no editar a mano. Ejecutar: npm run i18n:generate',
    '',
    '/**',
    ' * Claves de traducción. Uso: t(TR.forgotPassword) o $t(TR.create)',
    ' */',
    'export const TR = {'
  ]

  const entries = Object.entries(es)
  for (let i = 0; i < entries.length; i++) {
    const [key, text] = entries[i]
    const camel = toCamelCase(key)
    const comment = `  /** ${String(text).replace(/\*/g, '*')} | ${key} */`
    lines.push(comment)
    const escaped = String(key).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    const isLast = i === entries.length - 1
    lines.push(`  get ${camel}(): string { return "${escaped}" }${isLast ? '' : ','}`)
    lines.push('')
  }

  lines.push('} as const')
  lines.push('')
  lines.push('export type TRKey = typeof TR[keyof typeof TR]')
  lines.push('')

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, lines.join('\n'), 'utf-8')
  console.log('Generated:', outPath)
}

main()
