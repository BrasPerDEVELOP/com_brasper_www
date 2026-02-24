<template>
  <section
    id="agenda"
    class="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
  >
    <div class="absolute inset-0 bg-black/10"></div>

    <div class="relative mx-auto w-full max-w-7xl">
      <div class="grid grid-cols-1 items-center gap-8 lg:gap-12 xl:grid-cols-2 xl:gap-16">
        <div class="order-2 flex h-full flex-col justify-center xl:order-1">
          <div class="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm sm:p-10 lg:p-12 xl:rounded-3xl xl:p-14">
            <div class="text-center xl:text-left">
              <h2 class="mb-6 text-4xl font-bold leading-tight text-gray-800 sm:mb-8 sm:text-5xl md:text-6xl xl:text-7xl">
                {{ t('landing_schedule_transfer_title') }}
              </h2>
              <p class="mb-8 text-xl leading-relaxed text-gray-600 sm:mb-10 sm:text-2xl">
                {{ t('landing_schedule_transfer_description') }}
              </p>

              <div class="space-y-4 sm:space-y-5">
                <div class="flex items-center justify-center space-x-4 xl:justify-start">
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:h-10 sm:w-10">
                    <svg class="h-5 w-5 text-green-600 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span class="text-base font-medium text-gray-700 sm:text-lg">
                    {{ t('landing_schedule_feature_1_title') }}
                  </span>
                </div>

                <div class="flex items-center justify-center space-x-4 xl:justify-start">
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-10 sm:w-10">
                    <svg class="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span class="text-base font-medium text-gray-700 sm:text-lg">
                    {{ t('landing_schedule_feature_2_title') }}
                  </span>
                </div>

                <div class="flex items-center justify-center space-x-4 xl:justify-start">
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 sm:h-10 sm:w-10">
                    <svg class="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span class="text-base font-medium text-gray-700 sm:text-lg">
                    {{ t('landing_schedule_feature_3_title') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="order-1 flex h-full flex-col justify-center xl:order-2">
          <div class="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm sm:p-10 lg:p-12 xl:rounded-3xl xl:p-14">
            <form class="space-y-5 sm:space-y-6" @submit.prevent="handleSendWhatsApp">
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div class="space-y-3">
                  <label for="transferDate" class="block text-base font-semibold text-gray-700">
                    {{ t('landing_schedule_transfer_date') }} *
                  </label>
                  <input
                    id="transferDate"
                    v-model="form.transferDate"
                    type="date"
                    :min="today"
                    required
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div class="space-y-3">
                  <label for="amount" class="block text-base font-semibold text-gray-700">
                    {{ t('landing_schedule_amount') }}
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-gray-500">
                      {{ currencySymbol }}
                    </span>
                    <input
                      id="amount"
                      v-model="form.amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      class="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-base transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div class="space-y-3">
                  <label for="dniCpf" class="block text-base font-semibold text-gray-700">
                    {{ t('landing_schedule_dni_cpf') }} *
                  </label>
                  <input
                    id="dniCpf"
                    v-model="form.dniCpf"
                    type="text"
                    required
                    :placeholder="dniPlaceholder"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div class="space-y-3">
                  <label for="fullNames" class="block text-base font-semibold text-gray-700">
                    {{ t('landing_schedule_full_names') }} *
                  </label>
                  <input
                    id="fullNames"
                    v-model="form.fullNames"
                    type="text"
                    required
                    :placeholder="namePlaceholder"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div class="space-y-3">
                  <label for="phone" class="block text-base font-semibold text-gray-700">
                    {{ t('landing_schedule_phone') }} *
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    required
                    :placeholder="phonePlaceholder"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div class="space-y-3">
                  <label for="email" class="block text-base font-semibold text-gray-700">
                    {{ t('landing_schedule_email') }}
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div class="space-y-3">
                <label for="currencyRange" class="block text-base font-semibold text-gray-700">
                  {{ t('landing_schedule_currency_range') }}
                </label>
                <select
                  id="currencyRange"
                  v-model="form.currencyRange"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pen-brl">PEN → BRL</option>
                  <option value="brl-pen">BRL → PEN</option>
                  <option value="usd-brl">USD → BRL</option>
                  <option value="brl-usd">BRL → USD</option>
                </select>
              </div>

              <div class="pt-4">
                <button
                  type="submit"
                  class="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-700"
                >
                  <svg class="mr-3 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  {{ whatsapp.buttonText }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type Locale = 'es' | 'en' | 'pt'
type CurrencyRange = 'pen-brl' | 'brl-pen' | 'usd-brl' | 'brl-usd'

interface FormState {
  transferDate: string
  dniCpf: string
  fullNames: string
  currencyRange: CurrencyRange
  amount: string
  phone: string
  email: string
}

interface WhatsAppCopy {
  validationErrors: {
    title: string
    message: string
    button: string
  }
  invalidDate: {
    title: string
    message: string
    button: string
  }
  invalidAmount: {
    title: string
    message: string
    button: string
  }
  invalidEmail: {
    title: string
    message: string
    button: string
  }
  missingEmail: string
  missingAmount: string
  buttonText: string
  template: string
}

const { locale, t } = useI18n()

const form = ref<FormState>({
  transferDate: '',
  dniCpf: '',
  fullNames: '',
  currencyRange: 'pen-brl',
  amount: '',
  phone: '',
  email: ''
})

const whatsappData: Record<Locale, WhatsAppCopy> = {
  es: {
    validationErrors: {
      title: 'Aviso',
      message: 'Por favor, complete todos los campos obligatorios',
      button: 'Entendido'
    },
    invalidDate: {
      title: 'Aviso',
      message: 'La fecha no puede ser anterior a hoy',
      button: 'Entendido'
    },
    invalidAmount: {
      title: 'Aviso',
      message: 'El monto debe ser un número positivo',
      button: 'Entendido'
    },
    invalidEmail: {
      title: 'Aviso',
      message: 'El formato del correo electrónico no es válido',
      button: 'Entendido'
    },
    missingEmail: 'No proporcionado',
    missingAmount: 'No especificado',
    buttonText: 'Enviar por WhatsApp',
    template:
      '¡Hola! Me gustaría programar una transferencia con Brasper:\n\n*Fecha deseada:* {date}\n*DNI:* {dni}\n*Nombres:* {names}\n*Teléfono:* {phone}\n*Email:* {email}\n*Tipo de cambio:* {currencyRange}\n*Monto:* {amount}\n\n¡Gracias por su atención!'
  },
  en: {
    validationErrors: {
      title: 'Notice',
      message: 'Please complete all required fields',
      button: 'Got it'
    },
    invalidDate: {
      title: 'Notice',
      message: 'The date cannot be before today',
      button: 'Got it'
    },
    invalidAmount: {
      title: 'Notice',
      message: 'The amount must be a positive number',
      button: 'Got it'
    },
    invalidEmail: {
      title: 'Notice',
      message: 'The email format is not valid',
      button: 'Got it'
    },
    missingEmail: 'Not provided',
    missingAmount: 'Not specified',
    buttonText: 'Send via WhatsApp',
    template:
      'Hello! I would like to schedule a transfer with Brasper:\n\n*Desired date:* {date}\n*ID:* {dni}\n*Names:* {names}\n*Phone:* {phone}\n*Email:* {email}\n*Exchange type:* {currencyRange}\n*Amount:* {amount}\n\nThank you for your attention!'
  },
  pt: {
    validationErrors: {
      title: 'Aviso',
      message: 'Por favor, preencha todos os campos obrigatórios',
      button: 'Entendi'
    },
    invalidDate: {
      title: 'Aviso',
      message: 'A data não pode ser anterior a hoje',
      button: 'Entendi'
    },
    invalidAmount: {
      title: 'Aviso',
      message: 'O valor deve ser um número positivo',
      button: 'Entendi'
    },
    invalidEmail: {
      title: 'Aviso',
      message: 'O formato do email não é válido',
      button: 'Entendi'
    },
    missingEmail: 'Não informado',
    missingAmount: 'Não especificado',
    buttonText: 'Enviar via WhatsApp',
    template:
      'Olá! Gostaria de agendar uma transferência com Brasper:\n\n*Data desejada:* {date}\n*CPF:* {dni}\n*Nomes:* {names}\n*Telefone:* {phone}\n*Email:* {email}\n*Tipo de câmbio:* {currencyRange}\n*Valor:* {amount}\n\nObrigado pela atenção!'
  }
}

const today = computed(() => new Date().toISOString().split('T')[0])

const currentLocale = computed<Locale>(() => {
  const localeValue = locale.value
  return localeValue === 'es' || localeValue === 'en' || localeValue === 'pt' ? localeValue : 'es'
})

const whatsapp = computed(() => whatsappData[currentLocale.value])

const currencySymbol = computed(() => {
  switch (form.value.currencyRange) {
    case 'pen-brl':
      return 'S/'
    case 'brl-pen':
      return 'R$'
    case 'usd-brl':
      return '$'
    case 'brl-usd':
      return 'R$'
    default:
      return 'S/'
  }
})

const dniPlaceholder = computed(() => {
  if (currentLocale.value === 'es') return '12345678'
  if (currentLocale.value === 'pt') return '12345678901'
  return '123456789'
})

const namePlaceholder = computed(() => {
  if (currentLocale.value === 'es') return 'Juan Pérez'
  if (currentLocale.value === 'pt') return 'João Silva'
  return 'John Doe'
})

const phonePlaceholder = computed(() => {
  if (currentLocale.value === 'es') return '+51 999 999 999'
  if (currentLocale.value === 'pt') return '+55 11 99999-9999'
  return '+1 555 555 5555'
})

const showWarning = (copy: { title: string; message: string; button: string }) => {
  window.alert(`${copy.title}: ${copy.message}\n\n${copy.button}`)
}

const formatCurrencyRange = (range: CurrencyRange) => {
  const labels: Record<CurrencyRange, Record<Locale, string>> = {
    'pen-brl': {
      es: 'Soles a Reales',
      en: 'Soles to Reais',
      pt: 'Soles para Reais'
    },
    'brl-pen': {
      es: 'Reales a Soles',
      en: 'Reais to Soles',
      pt: 'Reais para Soles'
    },
    'usd-brl': {
      es: 'Dólares a Reales',
      en: 'Dollars to Reais',
      pt: 'Dólares para Reais'
    },
    'brl-usd': {
      es: 'Reales a Dólares',
      en: 'Reais to Dollars',
      pt: 'Reais para Dólares'
    }
  }

  return labels[range][currentLocale.value]
}

const validateForm = () => {
  if (!form.value.transferDate || !form.value.dniCpf.trim() || !form.value.fullNames.trim() || !form.value.phone.trim()) {
    showWarning(whatsapp.value.validationErrors)
    return false
  }

  const selectedDate = new Date(`${form.value.transferDate}T00:00:00`)
  const dateToday = new Date()
  dateToday.setHours(0, 0, 0, 0)

  if (selectedDate < dateToday) {
    showWarning(whatsapp.value.invalidDate)
    return false
  }

  if (form.value.amount) {
    const amount = Number(form.value.amount)
    if (Number.isNaN(amount) || amount <= 0) {
      showWarning(whatsapp.value.invalidAmount)
      return false
    }
  }

  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    showWarning(whatsapp.value.invalidEmail)
    return false
  }

  return true
}

const handleSendWhatsApp = () => {
  if (!validateForm()) {
    return
  }

  const message = whatsapp.value.template
    .replace(/{date}/g, form.value.transferDate)
    .replace(/{dni}/g, form.value.dniCpf)
    .replace(/{names}/g, form.value.fullNames)
    .replace(/{phone}/g, form.value.phone)
    .replace(/{email}/g, form.value.email || whatsapp.value.missingEmail)
    .replace(/{currencyRange}/g, formatCurrencyRange(form.value.currencyRange))
    .replace(/{amount}/g, form.value.amount ? `${currencySymbol.value}${form.value.amount}` : whatsapp.value.missingAmount)

  const phoneNumber = '51966991933'
  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
}
</script>
