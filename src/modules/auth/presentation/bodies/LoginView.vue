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

onMounted(() => {
  if (!username.value) username.value = env.username
  if (!password.value) password.value = env.password
})

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value)
    router.push((router.currentRoute.value.query.redirect as string) || '/dashboard')
  } catch (error) {
    // Error ya manejado en el store
  }
}
</script>
