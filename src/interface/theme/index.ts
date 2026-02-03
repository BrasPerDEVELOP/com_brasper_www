// Tema compartido de la aplicación

export { ColorRepository } from './color-repository'
export type { ColorRepositoryKey } from './color-repository'
export { createLightTheme } from './light-theme-adapter'
export type { ColorScheme } from './light-theme-adapter'
export { createTheme } from './theme-factory'
export { applyThemeToDocument } from './apply-theme'
export { useTheme, ThemeKey, primaryColor, mainColor } from './useTheme'

/** Spacing y breakpoints (complemento al ColorScheme) */
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px'
} as const

export const breakpoints = {
  mobile: 600,
  tablet: 960,
  desktop: 1280
} as const
