import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './interface/router'
import { i18n } from './interface/presentation/i18n'
import { setAuthCallbacks } from './interface/api/client'
import { useAuthStore } from './modules/auth/presentation/controllers/useAuthStore'
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
    router.push({ path: '/auth', query: redirect && redirect !== '/auth' ? { redirect } : undefined })
  }
)

app.mount('#app')

/* if (typeof window !== 'undefined' && (window as any).EmbeddingGemmaChat) {
  ;(window as any).EmbeddingGemmaChat.init({
    apiUrl: import.meta.env.VITE_CHAT_API_URL as string,
    title: 'Asistente Brasper',
    position: 'bottom-right',
    subtitle: 'Remesas y consultas',
    primaryColor: '#4a52d8',
    secondaryColor: '#01e8fc',
    welcomeMessage: 'Hola, ¿en qué te ayudo?',
    launcherImageUrl: '/assets/projects/bot.gif',
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap',
    onOpen: () => console.log('chat abierto'),
  })
}  */
 
useAuthStore().restoreSession()
