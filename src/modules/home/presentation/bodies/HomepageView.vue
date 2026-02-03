<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-surface-alt px-4">
    <div class="w-full max-w-md space-y-8 text-center">
      <h1 class="text-4xl font-bold text-primary">
        Brasper
      </h1>
      <p class="text-lg text-on-surface/80">
        Transfiere de forma segura. Inicia sesión para acceder a tu dashboard.
      </p>
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <router-link
          to="/auth"
          class="rounded-lg bg-primary px-6 py-3 text-center font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Iniciar sesión
        </router-link>
        <router-link
          to="/register"
          class="rounded-lg border border-primary px-6 py-3 text-center font-medium text-primary transition-colors hover:bg-primary/10"
        >
          Registrarse
        </router-link>
      </div>
      <template v-if="authStore.user">
        <router-link
          :to="{ name: 'home' }"
          class="inline-block rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
        >
          Ir al dashboard →
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/presentation/controllers/useAuthStore'

const authStore = useAuthStore()
</script>
