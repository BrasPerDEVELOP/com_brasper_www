<template>
  <router-view />
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { createTheme } from '@/interface/theme/theme-factory'
import { ThemeKey } from '@/interface/theme/useTheme'

provide(ThemeKey, createTheme())
</script>
