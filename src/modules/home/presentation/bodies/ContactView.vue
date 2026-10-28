<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <Navbar />
    <main class="mx-auto max-w-3xl px-4 pb-20 pt-32">
      <router-link :to="{ name: 'homepage', params: { locale: routeLocale } }" class="text-azure-700 underline">{{ copy.back }}</router-link>
      <h1 class="mt-6 text-3xl font-bold">{{ complaint ? t('footer_contact_complaints') : t('footer_contact_title') }}</h1>
      <p class="mt-3 text-slate-600">{{ copy.intro }}</p>
      <div class="my-6 flex flex-wrap gap-4">
        <a href="mailto:info@braspertransferencias.com" class="break-all text-azure-700 underline">info@braspertransferencias.com</a>
        <a href="https://wa.me/51966991933" target="_blank" rel="noopener noreferrer" class="text-azure-700 underline">WhatsApp ↗</a>
      </div>
      <form class="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" @submit.prevent="submit">
        <label class="block font-medium">{{ copy.name }}
          <input v-model="form.fullName" required maxlength="200" autocomplete="name" class="mt-2 block w-full rounded-lg border border-slate-300 p-3" />
        </label>
        <label class="block font-medium">{{ copy.email }}
          <input v-model="form.email" required type="email" maxlength="255" autocomplete="email" class="mt-2 block w-full rounded-lg border border-slate-300 p-3" />
        </label>
        <label class="block font-medium">{{ copy.subject }}
          <input v-model="form.subject" required maxlength="500" class="mt-2 block w-full rounded-lg border border-slate-300 p-3" />
        </label>
        <label class="block font-medium">{{ complaint ? copy.complaint : copy.message }}
          <textarea v-model="form.message" required maxlength="10000" rows="6" class="mt-2 block w-full rounded-lg border border-slate-300 p-3" />
        </label>
        <p v-if="error" role="alert" class="text-red-700">{{ copy.error }}</p>
        <p v-if="receipt" role="status" class="break-words rounded-lg bg-green-50 p-4 text-green-800">{{ copy.success }} {{ receipt }}</p>
        <button :disabled="sending" type="submit" class="rounded-lg bg-azure-900 px-6 py-3 font-semibold text-white hover:bg-azure-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure-700 disabled:opacity-60">{{ sending ? copy.sending : copy.send }}</button>
      </form>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navbar from '@/interface/layout/Navbar.vue'
import Footer from '@/interface/layout/Footer.vue'
import { useLanguage } from '@/interface/presentation/composables/useLanguage'
import { apiClient } from '@/interface/api/client'
import { Domain } from '@/interface/infrastructure/services'

const { t, locale } = useI18n()
const { routeLocale } = useLanguage()
const route = useRoute()
const complaint = computed(() => route.query.type === 'complaint')
const form = reactive({ fullName: '', email: '', subject: '', message: '' })
const sending = ref(false)
const error = ref(false)
const receipt = ref('')
watch(() => route.query.type, () => { receipt.value = ''; error.value = false })
const translations = {
  es: { back: 'Volver al inicio', intro: 'Envíanos tu consulta o reclamo. También puedes contactarnos por correo o WhatsApp.', name: 'Nombre completo', email: 'Correo electrónico', subject: 'Asunto / referencia de operación', message: 'Mensaje', complaint: 'Detalle del reclamo y solución solicitada', send: 'Enviar', sending: 'Enviando…', error: 'No pudimos enviar el formulario. Inténtalo de nuevo o contáctanos por correo o WhatsApp.', success: 'Recibimos tu mensaje. Referencia:' },
  pt: { back: 'Voltar ao início', intro: 'Envie sua consulta ou reclamação. Você também pode entrar em contato por e-mail ou WhatsApp.', name: 'Nome completo', email: 'E-mail', subject: 'Assunto / referência da operação', message: 'Mensagem', complaint: 'Detalhes da reclamação e solução solicitada', send: 'Enviar', sending: 'Enviando…', error: 'Não foi possível enviar. Tente novamente ou entre em contato por e-mail ou WhatsApp.', success: 'Recebemos sua mensagem. Referência:' },
  en: { back: 'Back to home', intro: 'Send us your question or complaint. You can also contact us by email or WhatsApp.', name: 'Full name', email: 'Email', subject: 'Subject / transaction reference', message: 'Message', complaint: 'Complaint details and requested resolution', send: 'Send', sending: 'Sending…', error: 'We could not send your message. Try again or contact us by email or WhatsApp.', success: 'We received your message. Reference:' }
}
const copy = computed(() => translations[locale.value as keyof typeof translations] || translations.es)
async function submit() {
  if (sending.value) return
  if (![form.fullName, form.email, form.subject, form.message].every(value => value.trim())) return
  sending.value = true
  error.value = false
  receipt.value = ''
  try {
    const response = await apiClient.post<{ id: string }>(Domain.apiPath('brasper/contact-form'), {
      fullName: form.fullName.trim(), email: form.email.trim(),
      affiliation: 'Brasper web', profile: 'customer', interest: form.subject.trim(),
      message: form.message.trim(), locale: locale.value,
      source: complaint.value ? 'website-complaint' : 'website-contact'
    }, { timeout: 20000 })
    receipt.value = response.data.id
    form.subject = ''
    form.message = ''
  } catch {
    error.value = true
  } finally {
    sending.value = false
  }
}
</script>
