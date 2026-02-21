<template>
  <div class="flex justify-center items-center min-h-screen bg-surface-alt">
    <div class="w-full max-w-[400px] bg-white p-8 rounded-lg shadow-md">
      <h1 class="mb-6 text-center text-on-surface text-2xl font-semibold">
        {{ t(TR.login) }}
      </h1>
      <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
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
        <p v-if="authStore.error" class="text-sm text-center text-error">
          {{ authStore.error }}
        </p>
        <p class="text-center text-sm text-on-surface/80">
          ¿No tienes cuenta?
          <router-link to="/register" class="font-medium text-primary hover:underline">
            {{ t(TR.createAccount) }}
          </router-link>
        </p>
      </form>
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
import { useAuthStore } from '../controllers/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const username = ref(env.username)
const password = ref(env.password)

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function deriveAesKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 120000,
      hash: 'SHA-256'
    },
    material,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt']
  )
}

async function encryptAdminPayload(payload: object, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await deriveAesKey(secret, salt)
  const plain = new TextEncoder().encode(JSON.stringify(payload))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain)
  return {
    data: toBase64Url(new Uint8Array(encrypted)),
    iv: toBase64Url(iv),
    salt: toBase64Url(salt)
  }
}

async function redirectAdminToExternal() {
  const token = authStore.token ?? localStorage.getItem('token')
  if (!authStore.user || !token) return false

  const targetUrl = env.adminRedirectUrl.trim()
  const secret = env.adminRedirectSecret.trim()
  if (!targetUrl || !secret) return false

  const payload = {
    token,
    user: authStore.user,
    issuedAt: Date.now()
  }
  const encrypted = await encryptAdminPayload(payload, secret)
  const url = new URL(targetUrl)
  url.searchParams.set('data', encrypted.data)
  url.searchParams.set('iv', encrypted.iv)
  url.searchParams.set('salt', encrypted.salt)
  url.searchParams.set('v', '1')
  window.location.assign(url.toString())
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
    console.log('origin', location.origin)
console.log('secure?', window.isSecureContext)
console.log('subtle?', !!window.crypto?.subtle)

    const isAdmin = normalizedRole === 'admin'
    if (isAdmin) {
      const redirected = await redirectAdminToExternal().catch((err) => {
        console.error('Admin redirect failed:', err)
        return false
      })
      if (!redirected && env.adminRedirectUrl.trim()) {
        authStore.error = 'No se pudo redirigir al panel admin externo. Revisa URL/secreto y HTTPS.'
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
