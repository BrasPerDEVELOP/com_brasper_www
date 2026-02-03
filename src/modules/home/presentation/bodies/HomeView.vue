<template>
  <div class="space-y-6">
    <section class="rounded-lg bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-semibold text-on-surface">Inicio</h1>
      <p class="mt-2 text-on-surface/80">
        Página principal. Aquí irá la calculadora y el botón para iniciar transferencia.
      </p>
      <div class="mt-4 flex gap-3">
        <router-link
          :to="{ name: 'step', params: { stepId: '1' } }"
          class="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Iniciar transferencia
        </router-link>
        <router-link
          :to="{ name: 'calculator' }"
          class="rounded border border-primary px-4 py-2 text-sm font-medium text-primary"
        >
          Calculadora
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>
