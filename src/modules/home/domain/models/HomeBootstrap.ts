export type HomeLocale = 'es' | 'pr' | 'en'
export interface HomeLocaleContent { eyebrow: string; title: string; subtitle: string; image_alt: string }
export interface HomeIndicator { icon: string; enabled: boolean; text: Record<HomeLocale, string> }
export interface HomeBannerConfig {
  id: string
  banner_es: string
  banner_pr: string
  banner_en: string
  enable: boolean
  updated_at?: string
  content: Record<HomeLocale, HomeLocaleContent>
  indicators: HomeIndicator[]
  appearance: { type: 'solid' | 'gradient'; primary: string; secondary: string; blur: boolean }
  show_image: boolean
  show_indicators: boolean
}
export interface HomeBootstrap { banner: HomeBannerConfig | null; rates: unknown[]; commissions: unknown[] }
