/**
 * Sistema de logs configurable por nivel.
 * Niveles: debug < info < warn < error
 * Configuración: VITE_LOG_LEVEL (debug | info | warn | error)
 */

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 } as const
type LevelName = keyof typeof LEVELS

function getLogLevel(): LevelName {
  const raw = typeof import.meta.env.VITE_LOG_LEVEL === 'string'
    ? (import.meta.env.VITE_LOG_LEVEL as string).toLowerCase()
    : ''
  if (raw in LEVELS) return raw as LevelName
  return import.meta.env.PROD ? 'warn' : 'debug'
}

const currentLevel = getLogLevel()
const levelValue = LEVELS[currentLevel]

function shouldLog(level: LevelName): boolean {
  return LEVELS[level] >= levelValue
}

function timestamp(): string {
  return new Date().toISOString()
}

function formatPrefix(context: string | undefined, level: LevelName): string {
  const ts = timestamp()
  const ctx = context ? ` [${context}]` : ''
  return `${ts} ${level.toUpperCase()}${ctx}`
}

function logMessage(
  level: LevelName,
  context: string | undefined,
  ...args: unknown[]
): void {
  if (!shouldLog(level)) return
  const prefix = formatPrefix(context, level)
  const consoleArgs = [prefix, ...args]
  if (level === 'error') {
    console.error(...consoleArgs)
  } else if (level === 'warn') {
    console.warn(...consoleArgs)
  } else {
    console.log(...consoleArgs)
  }
}

export interface Logger {
  debug(...args: unknown[]): void
  info(...args: unknown[]): void
  warn(...args: unknown[]): void
  error(...args: unknown[]): void
  /** Crea un logger hijo con contexto fijo (ej. nombre del módulo). */
  child(context: string): Logger
}

function createLogger(context?: string): Logger {
  return {
    debug(...args: unknown[]) {
      logMessage('debug', context, ...args)
    },
    info(...args: unknown[]) {
      logMessage('info', context, ...args)
    },
    warn(...args: unknown[]) {
      logMessage('warn', context, ...args)
    },
    error(...args: unknown[]) {
      logMessage('error', context, ...args)
    },
    child(name: string) {
      const childContext = context ? `${context}:${name}` : name
      return createLogger(childContext)
    }
  }
}

/** Logger raíz sin contexto. */
export const log = createLogger()

/** Crea un logger con contexto (ej. módulo o servicio). */
export function createLoggerWithContext(context: string): Logger {
  return createLogger(context)
}
