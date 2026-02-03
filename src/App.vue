<template>
  <router-view />
</template>

<script setup lang="ts">
import { provide, onMounted } from 'vue'
import { createTheme } from '@/interface/theme/theme-factory'
import { ThemeKey } from '@/interface/theme/useTheme'
import { useAuthStore } from '@/modules/auth/presentation/controllers/useAuthStore'

provide(ThemeKey, createTheme())

onMounted(() => {
  useAuthStore().restoreUser()
})
</script>
