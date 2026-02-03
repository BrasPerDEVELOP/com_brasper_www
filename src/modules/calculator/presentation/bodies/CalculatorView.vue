<template>
  <section class="rounded-lg bg-white p-6 shadow-sm">
    <h1 class="text-2xl font-semibold text-on-surface">Calculadora</h1>
    <p class="mt-1 text-sm text-on-surface/80">
      Monto, moneda origen/destino (PEN, USD, BRL), tasa y comisión.
    </p>

    <div v-if="calculatorStore.isLoading" class="mt-4 text-on-surface/70">
      Cargando tasas y comisiones...
    </div>
    <template v-else>
      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-on-surface">Envías</label>
          <input
            v-model.number="amountSendLocal"
            type="number"
            min="0"
            step="0.01"
            class="rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            placeholder="0.00"
            @input="onAmountSendInput"
          />
          <select
            :value="calculatorStore.currencyFrom"
            class="rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            @change="onFromChange($event)"
          >
            <option v-for="code in CURRENCY_CODES" :key="code" :value="code">
              {{ code }} — {{ CURRENCY_LABELS[code] }}
            </option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-on-surface">Recibes</label>
          <input
            v-model.number="amountReceiveLocal"
            type="number"
            min="0"
            step="0.01"
            class="rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            placeholder="0.00"
            @input="onAmountReceiveInput"
          />
          <select
            :value="calculatorStore.currencyTo"
            class="rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            @change="onToChange($event)"
          >
            <option
              v-for="code in calculatorStore.destinationOptions"
              :key="code"
              :value="code"
            >
              {{ code }} — {{ CURRENCY_LABELS[code] }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="calculatorStore.result" class="mt-4 rounded bg-surface-alt p-4 text-sm">
        <p><span class="font-medium">Tasa:</span> {{ calculatorStore.result.rate }}</p>
        <p><span class="font-medium">Comisión:</span> {{ calculatorStore.result.commission.toFixed(2) }}</p>
        <p><span class="font-medium">Total a enviar:</span> {{ calculatorStore.result.totalToSend.toFixed(2) }}</p>
      </div>
      <p v-if="calculatorStore.error" class="mt-2 text-sm text-error">
        {{ calculatorStore.error }}
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useCalculatorStore } from '../controllers/useCalculatorStore'
import { CURRENCY_CODES, CURRENCY_LABELS } from '../../domain/models'
import type { CurrencyCode } from '../../domain/models'

const calculatorStore = useCalculatorStore()
const amountSendLocal = ref(0)
const amountReceiveLocal = ref(0)

watch(
  () => calculatorStore.amountSend,
  (v) => { amountSendLocal.value = v },
  { immediate: true }
)
watch(
  () => calculatorStore.amountReceive,
  (v) => { amountReceiveLocal.value = v },
  { immediate: true }
)

function onAmountSendInput() {
  calculatorStore.setAmountSend(amountSendLocal.value || 0)
  calculatorStore.recalcFromSend()
  amountReceiveLocal.value = calculatorStore.amountReceive
}

function onAmountReceiveInput() {
  calculatorStore.setAmountReceive(amountReceiveLocal.value || 0)
  calculatorStore.recalcFromReceive()
  amountSendLocal.value = calculatorStore.amountSend
}

function onFromChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as CurrencyCode
  calculatorStore.setCurrencyFrom(value)
}

function onToChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as CurrencyCode
  calculatorStore.setCurrencyTo(value)
}

onMounted(() => {
  calculatorStore.loadData()
})
</script>
