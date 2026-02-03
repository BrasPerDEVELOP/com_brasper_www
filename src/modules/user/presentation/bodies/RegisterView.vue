<template>
  <div class="flex justify-center items-center min-h-screen bg-surface-alt">
    <div class="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
      <h1 class="mb-6 text-center text-on-surface text-2xl font-semibold">
        {{ t(TR.createAccount) }}
      </h1>
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <BaseInput
          v-model="form.names"
          label="Nombres"
          type="text"
        />
        <BaseInput
          v-model="form.lastnames"
          label="Apellidos"
          type="text"
        />
        <BaseInput
          v-model="form.email"
          :label="t(TR.email)"
          type="email"
          required
        />
        <BaseInput
          v-model="form.password"
          :label="t(TR.password)"
          type="password"
          required
        />
        <BaseInput
          v-model="form.document_number"
          label="Número de documento"
          type="text"
        />
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-on-surface">Tipo de documento</label>
          <select
            v-model="form.document_type"
            class="w-full px-3 py-2.5 text-base border border-gray-300 rounded focus:outline-none focus:border-primary"
          >
            <option :value="undefined">Seleccionar</option>
            <option v-for="opt in DOCUMENT_TYPES" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-[1fr_2fr] gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-on-surface">Código país</label>
            <select
              v-model="form.code_phone"
              class="w-full px-3 py-2.5 text-base border border-gray-300 rounded focus:outline-none focus:border-primary"
            >
              <option :value="undefined">—</option>
              <option v-for="opt in PHONE_CODES" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <BaseInput
            v-model="phoneStr"
            label="Teléfono (máx. 15 dígitos)"
            type="tel"
            placeholder="Ej. 987654321"
          />
        </div>
        <BaseButton type="submit" :disabled="registerStore.isLoading">
          {{ registerStore.isLoading ? '...' : t(TR.save) }}
        </BaseButton>
        <p v-if="registerStore.error" class="text-sm text-center text-error">
          {{ registerStore.error }}
        </p>
        <p class="text-center text-sm text-on-surface/80">
          ¿Ya tienes cuenta?
          <router-link to="/auth" class="font-medium text-primary hover:underline">
            {{ t(TR.login) }}
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BaseButton, BaseInput } from '@/interface/widgets'
import { TR } from '@/interface/domain/generated/tr'
import { DOCUMENT_TYPES, PHONE_CODES } from '@/interface/enums'
import type { DocumentType, PhoneCode } from '@/interface/enums'
import type { UserCreateCmd } from '../../domain/models'
import { useRegisterStore } from '../controllers/useRegisterStore'

const router = useRouter()
const { t } = useI18n()
const registerStore = useRegisterStore()

const form = ref<{
  names: string
  lastnames: string
  email: string
  password: string
  document_number: string
  document_type?: DocumentType
  code_phone?: PhoneCode
  phone?: number
}>({
  names: '',
  lastnames: '',
  email: '',
  password: '',
  document_number: '',
  document_type: undefined,
  code_phone: undefined,
  phone: undefined
})

const phoneStr = ref('')

watch(phoneStr, (v) => {
  const n = parseInt(v.replace(/\D/g, ''), 10)
  form.value.phone = Number.isNaN(n) ? undefined : Math.min(999999999999999, n)
})

async function handleSubmit() {
  registerStore.clearError()
  const cmd: UserCreateCmd = {
    names: form.value.names || undefined,
    lastnames: form.value.lastnames || undefined,
    email: form.value.email || undefined,
    password: form.value.password || undefined,
    document_number: form.value.document_number || undefined,
    document_type: form.value.document_type as DocumentType | undefined,
    role: 'client',
    phone: form.value.phone,
    code_phone: form.value.code_phone as PhoneCode | undefined
  }
  try {
    await registerStore.register(cmd)
    router.push('/auth')
  } catch {
    // Error ya mostrado en el store
  }
}
</script>
