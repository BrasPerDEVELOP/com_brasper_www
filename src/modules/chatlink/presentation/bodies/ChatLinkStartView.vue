<template>
  <div class="flex min-h-[50vh] items-center justify-center p-6 text-on-surface/70">
    {{ invalid ? 'El enlace de vinculación no es válido. Pídele uno nuevo al asistente.' : 'Abriendo tu cuenta…' }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { parsePendingChat, savePendingChat } from '../../infrastructure/adapters/ChatLinkApiAdapter'

const router = useRouter()
const invalid = ref(false)

onMounted(() => {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const chat = parsePendingChat(params.get('canal'), params.get('ref'))
  // Se quita el fragmento antes de cualquier redirección (login incluido): la referencia
  // del chat no queda en el historial ni en el parámetro `redirect`.
  window.history.replaceState(window.history.state, '', window.location.pathname)
  if (!chat) {
    invalid.value = true
    return
  }
  savePendingChat(chat)
  router.replace({ name: 'chat-link' })
})
</script>
