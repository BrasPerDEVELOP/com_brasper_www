<template>
  <div class="space-y-6">
    <section class="rounded-lg bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-semibold text-on-surface">Mis cuentas</h1>
      <p class="mt-2 text-on-surface/80">
        Ver mis cuentas bancarias registradas.
      </p>
      <div class="mt-4 flex gap-3">
        <router-link :to="{ name: 'accounts-personal' }" class="text-primary hover:underline">
          Administrar cuentas personales
        </router-link>
        <router-link :to="{ name: 'account-peru' }" class="text-primary hover:underline">
          Agregar cuenta Perú
        </router-link>
        <router-link :to="{ name: 'account-brasil' }" class="text-primary hover:underline">
          Agregar cuenta Brasil
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>
