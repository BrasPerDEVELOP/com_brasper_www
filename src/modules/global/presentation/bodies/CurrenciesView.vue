<template>
  <div class="p-6">
    <h1 class="text-on-surface text-2xl font-semibold mb-4">Monedas</h1>
    <div v-if="globalStore.isLoading" class="text-text-secondary">Cargando...</div>
    <div v-else-if="globalStore.error" class="text-error">
      {{ globalStore.error }}
    </div>
    <ul v-else class="list-disc list-inside space-y-1 text-on-surface">
      <li v-for="currency in globalStore.currencies" :key="currency.id">
        {{ currency.code }} - {{ currency.name }} ({{ currency.symbol }})
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGlobalStore } from '../controllers/useGlobalStore'

const globalStore = useGlobalStore()

onMounted(() => {
  globalStore.fetchCurrencies()
})
</script>
