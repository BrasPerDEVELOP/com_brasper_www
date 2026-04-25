import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './interface/router'
import { i18n } from './interface/presentation/i18n'
import { setAuthCallbacks } from './interface/api/client'
import { useAuthStore } from './modules/auth/presentation/controllers/useAuthStore'
import { appLocaleToRouteLocale } from './interface/presentation/i18n/locales'
import './interface/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

setAuthCallbacks(
  () => useAuthStore().token ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null),
  () => {
    useAuthStore().logout()
    const redirect = router.currentRoute.value.fullPath
    const locale = i18n.global.locale.value as 'es' | 'en' | 'pt'
    router.push({
      name: 'auth',
      params: { locale: appLocaleToRouteLocale(locale) },
      query: redirect ? { redirect } : undefined
    })
  }
)

app.mount('#app')

/* useAuthStore().restoreSession()
 */
/* function loadExternalStylesheet(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Unable to load script: ${src}`))
    document.body.appendChild(script)
  })
}

function scheduleChatWidgetLoad() {
  if (typeof window === 'undefined') return

  const initialize = async () => {
    try {
      loadExternalStylesheet('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css')
      await loadScript('/widgets/embedding-gemma-chat.iife.js')

      const widget = (window as Window & { EmbeddingGemmaChat?: { init: (config: Record<string, unknown>) => void } }).EmbeddingGemmaChat
      if (!widget) return

      widget.init({
        apiUrl: import.meta.env.VITE_CHAT_API_URL as string,
        title: 'Asistente Brasper',
        position: 'bottom-right',
        subtitle: 'Remesas y consultas',
        primaryColor: '#4a52d8',
        secondaryColor: '#01e8fc',
        welcomeMessage: 'Hola, ¿en qué te ayudo?',
        launcherImageUrl: '/assets/projects/bot.gif',
        fontImportUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap'
      })
    } catch {
      // El widget es secundario; no debe romper el render principal.
    }
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      void initialize()
    }, { timeout: 3000 })
    return
  }

  setTimeout(() => {
    void initialize()
  }, 1500)
} */ 
/* 
scheduleChatWidgetLoad() */
