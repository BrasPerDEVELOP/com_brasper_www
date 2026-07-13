import { computed, unref, watchEffect, type MaybeRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  DEFAULT_ROUTE_LOCALE,
  ROUTE_LOCALES,
  getLanguageTag,
  isRouteLocale,
  routeLocaleToAppLocale,
  type RouteLocale
} from '@/interface/presentation/i18n/locales'

interface SeoOptions {
  title: string
  description: string
  image?: string
  robots?: string
  type?: string
}

const DEFAULT_OG_IMAGE = '/assets/images/logo/logo-completo-332.png'

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

function upsertLink(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector)
  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

export function useSeo(options: MaybeRef<SeoOptions>) {
  const route = useRoute()
  const router = useRouter()
  const { locale } = useI18n()

  const routeLocale = computed<RouteLocale>(() => {
    const current = route.params.locale
    return isRouteLocale(current) ? current : DEFAULT_ROUTE_LOCALE
  })

  watchEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return

    const seo = unref(options)
    const currentAppLocale = locale.value === 'pt' ? 'pt' : locale.value === 'en' ? 'en' : 'es'
    const languageTag = getLanguageTag(currentAppLocale)
    const title = seo.title.trim()
    const description = seo.description.trim()
    const metaRobots = typeof route.meta.robots === 'string' ? route.meta.robots.trim() : ''
    const robots = seo.robots?.trim() || metaRobots || 'index,follow'
    const type = seo.type?.trim() || 'website'
    const imageUrl = new URL(seo.image || DEFAULT_OG_IMAGE, window.location.origin).toString()
    // Canonical sin query ni hash: usa solo el path normalizado para evitar
    // duplicados por UTM, filtros o anclas (#seccion).
    const canonicalUrl = new URL(route.path, window.location.origin).toString()

    document.title = title
    document.documentElement.lang = languageTag

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Brasper' })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: languageTag.replace('-', '_') })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })

    document.head
      .querySelectorAll('link[data-hreflang="true"]')
      .forEach((element) => element.parentNode?.removeChild(element))

    // No emitir hreflang/x-default en páginas noindex (auth, register): no deben
    // participar en el grupo de idiomas indexable.
    if (route.meta.localized === true && route.name && !robots.includes('noindex')) {
      ROUTE_LOCALES.forEach((altLocale) => {
        const href = new URL(
          router.resolve({
            name: String(route.name),
            params: { ...route.params, locale: altLocale }
          }).href,
          window.location.origin
        ).toString()

        const link = document.createElement('link')
        link.setAttribute('rel', 'alternate')
        link.setAttribute('hreflang', getLanguageTag(routeLocaleToAppLocale(altLocale)))
        link.setAttribute('href', href)
        link.setAttribute('data-hreflang', 'true')
        document.head.appendChild(link)
      })

      const xDefault = document.createElement('link')
      xDefault.setAttribute('rel', 'alternate')
      xDefault.setAttribute('hreflang', 'x-default')
      xDefault.setAttribute(
        'href',
        new URL(
          router.resolve({
            name: String(route.name),
            params: { ...route.params, locale: DEFAULT_ROUTE_LOCALE }
          }).href,
          window.location.origin
        ).toString()
      )
      xDefault.setAttribute('data-hreflang', 'true')
      document.head.appendChild(xDefault)
    }
  })

  return {
    routeLocale
  }
}
