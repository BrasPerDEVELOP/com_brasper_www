import { onMounted, onScopeDispose, readonly, shallowRef } from 'vue'
import { apiClient } from '@/interface/api/client'
import type {
  WorldCupCoupon,
  WorldCupLiveResponse,
  WorldCupMatch
} from '../../domain/models/WorldCupLive'

const ENDPOINT = 'world-cup/public/live'
const POLL_INTERVAL_MS = 60_000

// Estado compartido (singleton) — igual patrón resiliente que useHomeBootstrap.
const live = shallowRef<WorldCupMatch[]>([])
const next = shallowRef<WorldCupMatch | null>(null)
const loading = shallowRef(false)

let pollTimer: number | undefined
let request: Promise<void> | null = null
let started = false
let consumers = 0

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function parseCoupon(raw: unknown): WorldCupCoupon | null {
  if (raw == null || typeof raw !== 'object') return null
  const item = raw as Record<string, unknown>
  const code = asString(item.code)
  if (!code) return null
  const discount = Number(item.discount_percentage ?? 0)
  const scope = asString(item.exchange_rate_scope).toUpperCase()
  return {
    code,
    discount_percentage: Number.isFinite(discount) ? discount : 0,
    exchange_rate_scope: (scope || 'ALL') as WorldCupCoupon['exchange_rate_scope'],
    ends_at_estimate: asString(item.ends_at_estimate) || null
  }
}

function parseMatch(raw: unknown): WorldCupMatch | null {
  if (raw == null || typeof raw !== 'object') return null
  const item = raw as Record<string, unknown>
  const home = asString(item.home_team)
  const away = asString(item.away_team)
  if (!home && !away) return null
  return {
    home_team: home,
    away_team: away,
    home_team_code: asString(item.home_team_code),
    away_team_code: asString(item.away_team_code),
    stage: asString(item.stage),
    starts_at: asString(item.starts_at),
    status: item.status === 'LIVE' ? 'LIVE' : null,
    coupon: parseCoupon(item.coupon)
  }
}

function parseResponse(data: unknown): WorldCupLiveResponse {
  if (data == null || typeof data !== 'object') return { live: [], next: null }
  const payload = data as Record<string, unknown>
  const liveMatches = Array.isArray(payload.live)
    ? payload.live.map(parseMatch).filter((m): m is WorldCupMatch => m !== null)
    : []
  return { live: liveMatches, next: parseMatch(payload.next) }
}

function fetchLive(): Promise<void> {
  if (request) return request
  loading.value = true
  request = apiClient
    .get<unknown>(ENDPOINT)
    .then((response) => {
      const parsed = parseResponse(response.data)
      live.value = parsed.live
      next.value = parsed.next
    })
    // Error SILENCIOSO: si falla, mantenemos lo último que teníamos (no rompe la home).
    .catch(() => undefined)
    .finally(() => {
      loading.value = false
      request = null
    })
  return request
}

function clearPoll(): void {
  if (pollTimer !== undefined) {
    window.clearInterval(pollTimer)
    pollTimer = undefined
  }
}

function schedulePoll(): void {
  clearPoll()
  if (typeof document !== 'undefined' && document.hidden) return
  pollTimer = window.setInterval(() => {
    void fetchLive()
  }, POLL_INTERVAL_MS)
}

function handleVisibilityChange(): void {
  if (document.hidden) {
    clearPoll()
    return
  }
  // Al volver a la pestaña: refrescamos de inmediato y reanudamos el polling.
  void fetchLive()
  schedulePoll()
}

function startPolling(): void {
  if (started || typeof window === 'undefined') return
  started = true
  void fetchLive()
  schedulePoll()
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }
}

function stopPolling(): void {
  clearPoll()
  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
  started = false
}

/**
 * Estado reactivo del Mundial en vivo. Llama a `world-cup/public/live` con el
 * mismo cliente que el resto de la home y hace polling cada 60s mientras la
 * pestaña esté visible. El polling se pausa con `document.hidden` y se reanuda
 * (con refresh inmediato) al volver. Los errores se ignoran en silencio.
 */
export function useWorldCupLive() {
  consumers += 1
  onMounted(startPolling)
  onScopeDispose(() => {
    consumers = Math.max(0, consumers - 1)
    if (consumers === 0) stopPolling()
  })
  return {
    live: readonly(live),
    next: readonly(next),
    loading: readonly(loading),
    refresh: fetchLive
  }
}
