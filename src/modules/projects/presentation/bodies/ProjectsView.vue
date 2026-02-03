<template>
  <div class="p-6">
    <h1 class="text-on-surface text-2xl font-semibold mb-4">Proyectos</h1>
    <div v-if="projectsStore.isLoading" class="text-text-secondary">Cargando...</div>
    <div v-else-if="projectsStore.error" class="text-error">
      {{ projectsStore.error }}
    </div>
    <ul v-else class="list-disc list-inside space-y-1 text-on-surface">
      <li v-for="project in projectsStore.projects" :key="project.id">
        {{ project.name }} - {{ project.status }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectsStore } from '../controllers/useProjectsStore'

const projectsStore = useProjectsStore()

onMounted(() => {
  projectsStore.fetchProjects()
})
</script>
