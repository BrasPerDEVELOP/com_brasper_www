<template>
  <div class="min-h-screen bg-surface-alt px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-stretch gap-6 lg:grid-cols-2">
      <section class="hidden rounded-3xl bg-gradient-to-br from-primary to-blue-medium p-10 text-white shadow-xl lg:flex lg:flex-col lg:justify-between">
        <div>
          <p class="inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
            Portal Cliente
          </p>
          <h1 class="mt-6 text-4xl font-bold leading-tight">
            Gestiona tus transferencias con seguridad y claridad.
          </h1>
          <p class="mt-4 max-w-md text-white/90">
            Ingresa a tu panel para revisar movimientos, estado de envíos y resumen de tus operaciones.
          </p>
        </div>

        <div class="space-y-3 rounded-2xl bg-white/15 p-5 backdrop-blur-sm">
          <p class="text-sm font-semibold uppercase tracking-wide text-white/90">Beneficios para clientes</p>
          <p class="text-sm text-white/90">Seguimiento en tiempo real</p>
          <p class="text-sm text-white/90">Historial de transacciones</p>
          <p class="text-sm text-white/90">Soporte personalizado</p>
        </div>
      </section>

      <section class="flex items-center justify-center rounded-3xl bg-white p-6 shadow-lg sm:p-10">
        <div class="w-full max-w-md">
          <p class="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">Acceso Seguro</p>
          <h2 class="mt-3 text-center text-3xl font-semibold text-on-surface">
            {{ t(TR.login) }}
          </h2>
          <p class="mt-2 text-center text-sm text-on-surface/70">
            Ingresa con tu cuenta de cliente para continuar.
          </p>

          <form class="mt-8 flex flex-col gap-4" @submit.prevent="handleLogin">
            <BaseInput
              v-model="username"
              label="Usuario"
              type="text"
              required
            />
            <BaseInput
              v-model="password"
              :label="t(TR.password)"
              type="password"
              required
            />
            <BaseButton type="submit" :disabled="authStore.isLoading">
              {{ authStore.isLoading ? '...' : t(TR.login) }}
            </BaseButton>
            <p v-if="authStore.error" class="rounded-lg bg-error/10 px-3 py-2 text-center text-sm text-error">
              {{ authStore.error }}
            </p>
            <p class="text-center text-sm text-on-surface/80">
              ¿No tienes cuenta?
              <router-link :to="{ name: 'register', params: { locale: routeLocale } }" class="font-medium text-primary hover:underline">
                {{ t(TR.createAccount) }}
              </router-link>
            </p>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BaseButton, BaseInput } from '@/interface/widgets'
import { TR } from '@/interface/domain/generated/tr'
import { env } from '@/interface/config/env'
import { useLanguage } from '@/interface/presentation/composables/useLanguage'
import { useSeo } from '@/interface/presentation/composables/useSeo'
import { useAuthStore } from '../controllers/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const { routeLocale } = useLanguage()

// Página privada: no indexar y evitar que herede el <head> de la página anterior.
useSeo({
  title: t('seo_login_title'),
  description: t('seo_login_description'),
  robots: 'noindex,follow'
})

const username = ref(env.username)
const password = ref(env.password)

function redirectAdminToExternal() {
  const targetUrl = env.adminRedirectUrl.trim()
  if (!targetUrl) return false

  // Nunca transferir JWT ni datos de sesión por URL. El backoffice restaura su
  // propia sesión mediante la cookie HttpOnly o solicita un nuevo inicio de sesión.
  const parsed = new URL(targetUrl)
  const local = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
  if (parsed.protocol !== 'https:' && !(import.meta.env.DEV && local)) {
    throw new Error('La URL del backoffice debe usar HTTPS')
  }
  window.location.assign(parsed.toString())
  return true
}

onMounted(() => {
  if (!username.value) username.value = env.username
  if (!password.value) password.value = env.password
})

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value)
    const normalizedRole = String(authStore.user?.role ?? '').trim().toLowerCase()

    const isAdmin = normalizedRole === 'admin'
    if (isAdmin) {
      const redirected = (() => {
        try {
          return redirectAdminToExternal()
        } catch (err) {
          console.error('Admin redirect failed:', err)
          return false
        }
      })()
      if (!redirected && env.adminRedirectUrl.trim()) {
        authStore.error = 'No se pudo redirigir al panel admin externo. Revisa la URL y HTTPS.'
        return
      }
      if (redirected) return
    }
    router.push((router.currentRoute.value.query.redirect as string) || '/dashboard')
  } catch (error) {
    // Error ya manejado en el store
  }
}
</script>
