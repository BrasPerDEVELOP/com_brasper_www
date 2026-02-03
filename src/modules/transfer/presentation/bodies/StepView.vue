<template>
  <div class="space-y-6">
    <section class="rounded-lg bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-semibold text-on-surface">
        Transferencia — Paso {{ stepId }} de {{ transferStore.totalSteps }}
      </h1>
      <nav class="mt-4 flex flex-wrap gap-2">
        <router-link
          v-for="s in transferStore.totalSteps"
          :key="s"
          :to="{ name: 'step', params: { stepId: String(s) } }"
          class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            Number(stepId) === s
              ? 'bg-primary text-white'
              : 'bg-surface-alt text-on-surface hover:bg-surface-alt/80'
          "
        >
          Paso {{ s }}
        </router-link>
      </nav>
    </section>

    <!-- Paso 1: Calculadora -->
    <CalculatorView v-if="currentStep === 1" />

    <!-- Paso 2: Seleccionar cuenta origen -->
    <section v-else-if="currentStep === 2" class="rounded-lg bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-on-surface">Seleccionar cuenta origen</h2>
      <p class="mt-2 text-on-surface/80">
        Cuenta desde la que envías. Par: {{ calculatorStore.currencyFrom }} →
        {{ calculatorStore.currencyTo }}.
      </p>
      <div v-if="transferStore.isLoading" class="mt-4 text-on-surface/70">Cargando cuentas...</div>
      <template v-else>
        <div class="mt-4 flex flex-col gap-2">
          <label class="text-sm font-medium text-on-surface">Cuenta origen (bank_account_id)</label>
          <select
            :value="transferStore.originAccountId ?? ''"
            class="rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            @change="onOriginAccountChange($event)"
          >
            <option value="">— Elige una cuenta —</option>
            <option
              v-for="acc in transferStore.originAccounts"
              :key="acc.id"
              :value="acc.id"
            >
              {{ acc.holder_names }} {{ acc.holder_surnames }} — {{ acc.bank_country }} ({{ acc.id }})
            </option>
          </select>
          <p v-if="!transferStore.originAccounts.length" class="text-sm text-on-surface/80">
            No hay cuentas de origen. <router-link :to="{ name: 'accounts' }" class="text-primary underline">Ir a Mis cuentas</router-link>
          </p>
        </div>
        <p v-if="transferStore.error" class="mt-2 text-sm text-error">{{ transferStore.error }}</p>
        <div class="mt-4 flex gap-3">
          <router-link
            :to="{ name: 'accounts' }"
            class="rounded border border-primary px-4 py-2 text-sm font-medium text-primary"
          >
            Ir a Mis cuentas
          </router-link>
          <button
            type="button"
            class="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
            :disabled="!transferStore.originAccountId"
            @click="goNext"
          >
            Siguiente
          </button>
        </div>
      </template>
    </section>

    <!-- Paso 3: Confirmar y crear transacción -->
    <section v-else-if="currentStep === 3" class="rounded-lg bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-on-surface">Confirmar transacción</h2>
      <p class="mt-2 text-on-surface/80">
        Revisa los datos antes de crear la transferencia.
      </p>
      <div v-if="calculatorStore.result" class="mt-4 rounded bg-surface-alt p-4 text-sm">
        <p><span class="font-medium">Envías:</span> {{ calculatorStore.result.amountSend }} {{ calculatorStore.currencyFrom }}</p>
        <p><span class="font-medium">Recibes:</span> {{ calculatorStore.result.amountReceive.toFixed(2) }} {{ calculatorStore.currencyTo }}</p>
        <p><span class="font-medium">Tasa:</span> {{ calculatorStore.result.rate }}</p>
        <p><span class="font-medium">Comisión:</span> {{ calculatorStore.result.commission.toFixed(2) }}</p>
        <p><span class="font-medium">Cuenta origen:</span> {{ transferStore.originAccountId ?? '—' }}</p>
      </div>
      <p v-if="transferStore.error" class="mt-2 text-sm text-error">{{ transferStore.error }}</p>
      <div class="mt-4 flex gap-3">
        <button
          type="button"
          class="rounded border border-gray-300 px-4 py-2 text-sm font-medium"
          @click="goPrev"
        >
          Atrás
        </button>
        <button
          type="button"
          class="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          :disabled="transferStore.isLoading"
          @click="confirmAndCreate"
        >
          {{ transferStore.isLoading ? 'Creando...' : 'Confirmar y crear transferencia' }}
        </button>
      </div>
    </section>

    <!-- Paso 4: Completar pago / voucher -->
    <section v-else-if="currentStep === 4" class="rounded-lg bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-on-surface">Completar pago</h2>
      <p class="mt-2 text-on-surface/80">
        Sube el comprobante o voucher.
      </p>
      <div class="mt-4 flex gap-3">
        <button
          type="button"
          class="rounded border border-gray-300 px-4 py-2 text-sm font-medium"
          @click="goPrev"
        >
          Atrás
        </button>
        <router-link
          :to="{ name: 'confirmacion' }"
          class="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Finalizar
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTransferStore } from '../controllers/useTransferStore'
import { useCalculatorStore } from '@/modules/calculator/presentation/controllers/useCalculatorStore'
import CalculatorView from '@/modules/calculator/presentation/bodies/CalculatorView.vue'

const route = useRoute()
const router = useRouter()
const transferStore = useTransferStore()
const calculatorStore = useCalculatorStore()

const stepId = computed(() => route.params.stepId as string)
const currentStep = computed(() => Number(stepId.value) || 1)

watch(
  stepId,
  (id) => {
    const n = Number(id) || 1
    if (n >= 1 && n <= transferStore.totalSteps) transferStore.setStep(n)
  },
  { immediate: true }
)

function goNext() {
  transferStore.nextStep()
  router.push({ name: 'step', params: { stepId: String(transferStore.currentStep) } })
}

function goPrev() {
  transferStore.prevStep()
  router.push({ name: 'step', params: { stepId: String(transferStore.currentStep) } })
}

function onOriginAccountChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value
  transferStore.setOriginAccount(value || null)
}

async function confirmAndCreate() {
  try {
    await transferStore.createTransaction()
    goNext()
  } catch {
    // error ya en transferStore.error
  }
}

// Cargar cuentas al entrar al paso 2
watch(
  currentStep,
  (step) => {
    if (step === 2) transferStore.loadBankAccounts()
  },
  { immediate: true }
)
</script>
