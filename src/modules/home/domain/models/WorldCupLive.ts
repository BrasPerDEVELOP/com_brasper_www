/** Alcance del cupón sobre el par de monedas. ALL = aplica a cualquier par. */
export type WorldCupCouponScope = 'BRL_PEN' | 'PEN_BRL' | 'USD_BRL' | 'BRL_USD' | 'ALL'

/** Estado de un partido. LIVE = en curso; null = aún no inicia (next). */
export type WorldCupMatchStatus = 'LIVE' | null

/** Cupón asociado a un partido del Mundial (descuento sobre la COMISIÓN). */
export interface WorldCupCoupon {
  code: string
  /** Porcentaje de descuento sobre la comisión (no sobre la tasa). */
  discount_percentage: number
  exchange_rate_scope: WorldCupCouponScope
  /** ISO UTC. Fin estimado de la promo (para la cuenta regresiva). */
  ends_at_estimate: string | null
}

/** DTO de un partido (vivo o próximo) tal cual lo devuelve la API pública. */
export interface WorldCupMatch {
  home_team: string
  away_team: string
  home_team_code: string
  away_team_code: string
  stage: string
  /** ISO UTC. Inicio del partido. */
  starts_at: string
  status: WorldCupMatchStatus
  coupon: WorldCupCoupon | null
}

/** Respuesta de GET /world-cup/public/live (siempre 200). */
export interface WorldCupLiveResponse {
  live: WorldCupMatch[]
  next: WorldCupMatch | null
}
