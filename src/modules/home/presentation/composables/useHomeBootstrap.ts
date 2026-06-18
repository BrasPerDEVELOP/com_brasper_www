import { readonly, shallowRef } from 'vue'
import { apiClient } from '@/interface/api/client'
import type { HomeBootstrap } from '../../domain/models/HomeBootstrap'

const CACHE_KEY = 'brasper.homeBootstrap.v2'
const SESSION_KEY = 'brasper.homeBootstrap.seen'
const data = shallowRef<HomeBootstrap | null>(readCache())
const loading = shallowRef(false)
const showLoader = shallowRef(false)
const error = shallowRef(false)
let request: Promise<HomeBootstrap | null> | null = null

function readCache(): HomeBootstrap | null {
  if (typeof localStorage === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as HomeBootstrap | null } catch { return null }
}

export function useHomeBootstrap() {
  async function load(): Promise<HomeBootstrap | null> {
    if (request) return request
    loading.value = true
    error.value = false
    const firstVisit = typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(SESSION_KEY)
    let revealTimer: number | undefined
    let maxTimer: number | undefined
    if (firstVisit) {
      revealTimer = window.setTimeout(() => { showLoader.value = loading.value }, 150)
      maxTimer = window.setTimeout(() => { showLoader.value = false }, 1500)
    }
    request = apiClient.get<HomeBootstrap>('home-banner/home-bootstrap')
      .then((response) => {
        data.value = response.data
        localStorage.setItem(CACHE_KEY, JSON.stringify(response.data))
        return response.data
      })
      .catch(() => { error.value = true; return data.value })
      .finally(() => {
        loading.value = false
        showLoader.value = false
        if (revealTimer) window.clearTimeout(revealTimer)
        if (maxTimer) window.clearTimeout(maxTimer)
        if (firstVisit) sessionStorage.setItem(SESSION_KEY, '1')
      })
    return request
  }
  return { data: readonly(data), loading: readonly(loading), showLoader: readonly(showLoader), error: readonly(error), load }
}
