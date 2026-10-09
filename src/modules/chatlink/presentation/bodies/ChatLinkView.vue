<template>
  <div class="space-y-6">
    <section class="rounded-lg bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-semibold text-on-surface">Vincular chat</h1>
      <p class="mt-2 text-sm text-on-surface/70">
        Permite que el asistente de Brasper consulte el estado de tus envíos en un chat de Telegram o
        de la web. El código sirve una sola vez durante 5 minutos y la vinculación dura 30 minutos.
      </p>

      <div v-if="!pending && !issued" class="mt-4 rounded border border-gray-200 bg-gray-50 p-4 text-sm">
        No hay un chat pendiente. Abre esta página desde el enlace que te envía el asistente en el chat.
      </div>

      <div v-else-if="pending && !issued" class="mt-4 space-y-3">
        <p class="text-sm text-on-surface">
          Vas a vincular un chat de <strong>{{ channelLabel(pending.channel) }}</strong> a tu cuenta.
          Hazlo solo si iniciaste esta solicitud tú mismo desde ese chat.
        </p>
        <button
          type="button"
          class="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          :disabled="busy"
          @click="issue"
        >
          {{ busy ? 'Generando…' : 'Vincular este chat' }}
        </button>
      </div>

      <div v-if="issued" class="mt-4 space-y-3 text-sm">
        <template v-if="telegramLink">
          <p>Abre Telegram con este botón para completar la vinculación:</p>
          <a
            :href="telegramLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block rounded-lg bg-primary px-4 py-2.5 font-medium text-white"
          >
            Abrir el chat en Telegram
          </a>
        </template>
        <p>
          {{ telegramLink ? 'Si no se abre, copia' : 'Copia' }} este mensaje y envíalo en el chat:
        </p>
        <div class="flex flex-wrap items-center gap-2">
          <code class="break-all rounded border border-gray-200 bg-gray-50 px-3 py-2">{{ chatMessage }}</code>
          <button type="button" class="rounded border border-gray-300 px-3 py-2" @click="copy">
            {{ copied ? 'Copiado' : 'Copiar' }}
          </button>
        </div>
        <p class="text-on-surface/70">Vence a las {{ expiresLabel }}. No lo compartas con nadie.</p>
      </div>

      <p v-if="error" class="mt-3 text-sm text-red-600" role="alert">{{ error }}</p>
    </section>

    <section class="rounded-lg bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-on-surface">Retirar vinculaciones</h2>
      <p class="mt-2 text-sm text-on-surface/70">
        Anula los códigos pendientes y las vinculaciones activas de tus chats.
      </p>
      <button
        type="button"
        class="mt-3 rounded-lg border border-gray-300 px-4 py-2.5 text-sm disabled:opacity-60"
        :disabled="revoking"
        @click="revoke"
      >
        {{ revoking ? 'Retirando…' : 'Retirar todas' }}
      </button>
      <p v-if="revokedMessage" class="mt-2 text-sm text-on-surface" role="status">{{ revokedMessage }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { isAxiosError } from 'axios'
import type { ChatChannel, ChatLinkIssued, PendingChat } from '../../domain/ChatLink'
import { ChatLinkApiAdapter, clearPendingChat, readPendingChat } from '../../infrastructure/adapters/ChatLinkApiAdapter'

const adapter = new ChatLinkApiAdapter()
const pending = ref<PendingChat | null>(readPendingChat())
const issued = ref<ChatLinkIssued | null>(null)
const busy = ref(false)
const error = ref('')
const copied = ref(false)
const revoking = ref(false)
const revokedMessage = ref('')
const telegramBot = (import.meta.env.VITE_TELEGRAM_BOT_USERNAME as string | undefined)?.trim() ?? ''

const channelLabel = (channel: ChatChannel) => (channel === 'telegram' ? 'Telegram' : 'la web de Brasper')
const chatMessage = computed(() => (issued.value ? `/vincular ${issued.value.token}` : ''))
const telegramLink = computed(() =>
  issued.value?.channel === 'telegram' && /^[A-Za-z0-9_]{5,32}$/.test(telegramBot)
    ? `https://t.me/${telegramBot}?start=${issued.value.token}`
    : ''
)
const expiresLabel = computed(() =>
  issued.value ? new Date(issued.value.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
)

function describe(err: unknown): string {
  const status = isAxiosError(err) ? err.response?.status : undefined
  if (status === 429) return 'Ya tienes códigos pendientes. Espera unos minutos a que venzan.'
  if (status === 403) return 'Tu cuenta no puede vincular chats en este momento. Escríbele a un asesor.'
  if (status === 503) return 'La vinculación de chats no está disponible por ahora.'
  if (status === 422) return 'El enlace del chat no es válido. Pídele uno nuevo al asistente.'
  return 'No se pudo generar el código. Inténtalo de nuevo.'
}

async function issue() {
  if (!pending.value) return
  busy.value = true
  error.value = ''
  try {
    issued.value = await adapter.issue(pending.value.channel, pending.value.subject)
    clearPendingChat()
    pending.value = null
  } catch (err) {
    error.value = describe(err)
  } finally {
    busy.value = false
  }
}

async function copy() {
  try {
    await navigator.clipboard.writeText(chatMessage.value)
    copied.value = true
  } catch {
    copied.value = false
  }
}

async function revoke() {
  revoking.value = true
  revokedMessage.value = ''
  try {
    const count = await adapter.revokeAll()
    issued.value = null
    revokedMessage.value = count ? `Se retiraron ${count} vinculaciones.` : 'No había vinculaciones activas.'
  } catch (err) {
    revokedMessage.value = describe(err)
  } finally {
    revoking.value = false
  }
}
</script>
