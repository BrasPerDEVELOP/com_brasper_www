import { ColorRepository } from './color-repository'

/**
 * Esquema de colores del tema.
 * Primario: #007bff (botones, links, headers, focus).
 * Sidebar/navbar: #007aff. Selects/modales/focus: #3b82f6.
 */
export interface ColorScheme {
  primary: string
  onPrimary: string
  secondary: string
  onSecondary: string
  /** Sidebar, navbar, bordes activos */
  sidebar: string
  /** Selects, modales, focus */
  focus: string
  /** Hover sobre primario */
  primaryHover: string
  surface: string
  onSurface: string
  /** Texto secundario */
  textSecondary: string
  error: string
  onError: string
  success: string
  onSuccess: string
  disabled: string
  /** Alias para primary (compatibilidad con context.mainColor) */
  mainColor: string
  /** Fondos oscuros (secciones oscuras) */
  darkBg: string
  /** Texto sobre fondos oscuros */
  onDarkBg: string
}

function createLightColorScheme(): ColorScheme {
  return {
    primary: ColorRepository.primaryBlue,
    onPrimary: ColorRepository.white,
    secondary: ColorRepository.successGreen,
    onSecondary: ColorRepository.white,
    sidebar: ColorRepository.blueIos,
    focus: ColorRepository.blueTailwind,
    primaryHover: ColorRepository.blueMediumDark,
    surface: ColorRepository.grayLightAlt,
    onSurface: ColorRepository.textPrimary,
    textSecondary: ColorRepository.textSecondary,
    error: ColorRepository.error,
    onError: ColorRepository.white,
    success: ColorRepository.successGreen,
    onSuccess: ColorRepository.white,
    disabled: ColorRepository.disabled,
    mainColor: ColorRepository.primaryBlue,
    darkBg: ColorRepository.darkBg,
    onDarkBg: ColorRepository.white
  }
}

/**
 * Adapter del tema claro.
 * Color primario: #007bff. Sidebar: #007aff. Focus/selects: #3b82f6.
 */
export function createLightTheme(): ColorScheme {
  return createLightColorScheme()
}
