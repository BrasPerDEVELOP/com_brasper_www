<template>
  <div class="flex min-h-screen bg-surface text-on-surface font-sans">
    <!-- Sidebar -->
    <aside class="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div class="flex h-14 items-center border-b border-gray-200 px-4">
        <router-link :to="{ name: 'home' }" class="text-lg font-semibold text-primary">
          Brasper
        </router-link>
      </div>
      <nav class="flex flex-1 flex-col gap-1 p-3">
        <router-link
          v-for="item in sidebarItems"
          :key="item.label"
          :to="item.to"
          class="rounded-lg px-3 py-2.5 text-sm text-on-surface transition-colors hover:bg-surface-alt hover:text-primary"
          active-class="bg-primary/10 font-medium text-primary"
        >
          {{ item.label }}
        </router-link>
      </nav>
      <div class="border-t border-gray-200 p-3">
        <template v-if="authStore.user">
          <button
            type="button"
            class="w-full rounded-lg px-3 py-2.5 text-left text-sm text-on-surface transition-colors hover:bg-surface-alt hover:text-primary"
            @click="handleLogout"
          >
            Cerrar sesión
          </button>
        </template>
        <template v-else>
          <router-link
            to="/auth"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Iniciar sesión
          </router-link>
        </template>
      </div>
    </aside>
    <!-- Contenido -->
    <main class="flex-1 overflow-auto">
      <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/presentation/controllers/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const sidebarItems = [
  { to: { name: 'accounts' }, label: 'Mis cuentas' },
  { to: { name: 'step', params: { stepId: '1' } }, label: 'Transferencia' },
  { to: { name: 'transactions' }, label: 'Historial de transferencia' },
  { to: { name: 'tasas' }, label: 'Tasas' },
  { to: { name: 'comisiones' }, label: 'Comisiones' },
  { to: { name: 'profile' }, label: 'Perfil' }
]

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'homepage' })
}
</script>
