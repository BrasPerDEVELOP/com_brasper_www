/**
 * Repositorio de colores del tema.
 * Colores primarios, secundarios y más usados en el proyecto.
 */
export const ColorRepository = {
  // --- Primarios ---
  /** Azul primario: botones, enlaces, encabezados, chat, focus de inputs */
  primaryBlue: '#007bff',
  /** Azul iOS: sidebar, navbar, bordes activos, menús */
  blueIos: '#007aff',
  /** Azul Tailwind: React Select, modales, focus, estados seleccionados */
  blueTailwind: '#3b82f6',

  // --- Secundarios ---
  /** Azul medio: hover, acentos en blog */
  blueMedium: '#4484f3',
  blueMediumDark: '#066ac9',
  /** Verde/teal: éxito, CTAs, botones de confirmar */
  successTeal: '#5ED6B3',
  successGreen: '#10b981',
  /** Verde lima: acentos, badges, estados activos */
  lime: '#e6ff00',
  limeAlt: '#d3ff00',
  limeAlt2: '#cbf000',
  /** Morado: filtros activos, sidebar */
  purple: '#A386FF',
  /** Morado oscuro: FAQ, cupones, algunos botones */
  purpleDark: '#4A52D8',
  purpleDarkAlt: '#4B4BF8',
  purpleDarkAlt2: '#3C4DA7',

  // --- Texto ---
  /** Texto principal */
  textPrimary: '#333333',
  /** Texto secundario */
  textSecondary: '#555555',
  textSecondaryAlt: '#666666',

  // --- Errores / destructivos ---
  error: '#dc3545',
  errorAlt: '#f44336',

  // --- Fondos oscuros (secciones oscuras) ---
  darkBg: '#232b4d',
  darkBgAlt: '#0F123E',
  darkBgAlt2: '#1c284c',

  // --- Fondos claros ---
  white: '#ffffff',
  grayLight: '#f3f4f6',
  grayLightAlt: '#f9f9f9',

  // --- Utilidad ---
  disabled: '#d9d9d9'
} as const

export type ColorRepositoryKey = keyof typeof ColorRepository
