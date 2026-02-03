import { env } from '@/interface/config/env'
import type { ColorScheme } from './light-theme-adapter'
import { createLightTheme } from './light-theme-adapter'

/**
 * Factory del tema (equivalente a ThemeFactory en Flutter).
 * Según env.dark devuelve tema claro o oscuro.
 * Dark: de momento no hay implementación (queda abierto).
 */
export function createTheme(): ColorScheme {
  const dark = env.dark
  if (dark) {
    // TODO: implementar DarkThemeAdapter cuando exista
    return createLightTheme()
  }
  return createLightTheme()
}
