import type { ColorScheme } from './light-theme-adapter'

const VAR_PREFIX = '--color-'

/**
 * Aplica el ColorScheme como variables CSS en :root.
 * Los componentes usan var(--color-primary), var(--color-on-surface), etc.
 */
export function applyThemeToDocument(theme: ColorScheme): void {
  const root = document.documentElement
  root.style.setProperty(`${VAR_PREFIX}primary`, theme.primary)
  root.style.setProperty(`${VAR_PREFIX}on-primary`, theme.onPrimary)
  root.style.setProperty(`${VAR_PREFIX}secondary`, theme.secondary)
  root.style.setProperty(`${VAR_PREFIX}on-secondary`, theme.onSecondary)
  root.style.setProperty(`${VAR_PREFIX}sidebar`, theme.sidebar)
  root.style.setProperty(`${VAR_PREFIX}focus`, theme.focus)
  root.style.setProperty(`${VAR_PREFIX}primary-hover`, theme.primaryHover)
  root.style.setProperty(`${VAR_PREFIX}surface`, theme.surface)
  root.style.setProperty(`${VAR_PREFIX}on-surface`, theme.onSurface)
  root.style.setProperty(`${VAR_PREFIX}text-secondary`, theme.textSecondary)
  root.style.setProperty(`${VAR_PREFIX}error`, theme.error)
  root.style.setProperty(`${VAR_PREFIX}on-error`, theme.onError)
  root.style.setProperty(`${VAR_PREFIX}success`, theme.success)
  root.style.setProperty(`${VAR_PREFIX}on-success`, theme.onSuccess)
  root.style.setProperty(`${VAR_PREFIX}disabled`, theme.disabled)
  root.style.setProperty(`${VAR_PREFIX}main`, theme.mainColor)
  root.style.setProperty(`${VAR_PREFIX}dark-bg`, theme.darkBg)
  root.style.setProperty(`${VAR_PREFIX}on-dark-bg`, theme.onDarkBg)
}
