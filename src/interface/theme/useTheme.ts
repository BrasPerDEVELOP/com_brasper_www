import { inject, type InjectionKey } from 'vue'
import type { ColorScheme } from './light-theme-adapter'

export const ThemeKey: InjectionKey<ColorScheme> = Symbol('theme')

/**
 * Composable para obtener los colores del tema (equivalente a context.primaryColor / context.mainColor en Flutter).
 * Usar en componentes: const { primaryColor, mainColor } = useTheme()
 */
export function useTheme(): ColorScheme {
  const theme = inject(ThemeKey)
  if (!theme) {
    throw new Error('useTheme() debe usarse dentro de un componente que tenga el tema inyectado (App).')
  }
  return theme
}

/** Atajo: color primario del tema */
export function primaryColor(theme: ColorScheme): string {
  return theme.primary
}

/** Atajo: color principal (mismo que primary) */
export function mainColor(theme: ColorScheme): string {
  return theme.mainColor
}
