import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export interface PartnerItem {
  id: number
  logo: string
  name: string
  title: string
  description: string
  benefits: string[]
}

export function useLandingPartners() {
  const { t, locale } = useI18n()

  const secondaryPartnerCopy = computed(() => {
    if (locale.value === 'en') {
      return {
        name: 'Strategic Partner',
        title: 'Trusted Alliances',
        description:
          'We work with strategic partners who share our vision of making international transfers secure and efficient. These alliances allow us to deliver quality service and competitive exchange rates.',
        benefits: ['Trusted partner network', 'Cutting-edge technology', 'Service excellence']
      }
    }

    if (locale.value === 'pt') {
      return {
        name: 'Parceiro Estratégico',
        title: 'Alianças de Confiança',
        description:
          'Trabalhamos com parceiros estratégicos que compartilham nossa visão de facilitar transferências internacionais seguras e eficientes. Nossas alianças nos permitem oferecer serviços de qualidade e taxas competitivas.',
        benefits: ['Rede de parceiros confiáveis', 'Tecnologia de ponta', 'Excelência no atendimento']
      }
    }

    return {
      name: 'Partner Estratégico',
      title: 'Alianzas de Confianza',
      description:
        'Trabajamos con socios estratégicos que comparten nuestra visión de facilitar transferencias internacionales seguras y eficientes. Nuestras alianzas nos permiten ofrecer servicios de calidad y las mejores tasas de cambio del mercado.',
      benefits: ['Red de socios confiables', 'Tecnología de vanguardia', 'Servicio de excelencia']
    }
  })

  const partners = computed<PartnerItem[]>(() => [
    {
      id: 1,
      logo: '/assets/images/bancos/CLL-480.png',
      name: t('landing_partner_ccl_subtitle'),
      title: t('landing_partner_ccl_title'),
      description: t('landing_partner_ccl_description'),
      benefits: [t('landing_partner_ccl_feature_1'), t('landing_partner_ccl_feature_2'), t('landing_partner_ccl_feature_3')]
    },
    {
      id: 2,
      logo: '/assets/images/bancos/Fintech.png',
      name: secondaryPartnerCopy.value.name,
      title: secondaryPartnerCopy.value.title,
      description: secondaryPartnerCopy.value.description,
      benefits: secondaryPartnerCopy.value.benefits
    }
  ])

  const currentIndex = ref(0)
  const isAutoPlaying = ref(true)
  const logoErrors = ref<Record<number, boolean>>({})

  let autoplayInterval: ReturnType<typeof setInterval> | null = null
  let resumeTimeout: ReturnType<typeof setTimeout> | null = null

  const currentPartner = computed(() => partners.value[currentIndex.value])

  const clearAutoplayInterval = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval)
      autoplayInterval = null
    }
  }

  const clearResumeTimeout = () => {
    if (resumeTimeout) {
      clearTimeout(resumeTimeout)
      resumeTimeout = null
    }
  }

  const startAutoplay = () => {
    clearAutoplayInterval()

    if (!isAutoPlaying.value || partners.value.length <= 1) {
      return
    }

    autoplayInterval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % partners.value.length
    }, 5000)
  }

  const pauseAutoplayTemporarily = () => {
    isAutoPlaying.value = false
    clearResumeTimeout()
    resumeTimeout = setTimeout(() => {
      isAutoPlaying.value = true
    }, 10000)
  }

  const goToPartner = (index: number) => {
    currentIndex.value = index
    pauseAutoplayTemporarily()
  }

  const nextPartner = () => {
    currentIndex.value = (currentIndex.value + 1) % partners.value.length
    pauseAutoplayTemporarily()
  }

  const prevPartner = () => {
    currentIndex.value = (currentIndex.value - 1 + partners.value.length) % partners.value.length
    pauseAutoplayTemporarily()
  }

  const markLogoError = (partnerId: number) => {
    logoErrors.value = { ...logoErrors.value, [partnerId]: true }
  }

  watch(
    () => [isAutoPlaying.value, partners.value.length] as const,
    () => {
      if (currentIndex.value > partners.value.length - 1) {
        currentIndex.value = 0
      }
      startAutoplay()
    },
    { immediate: true }
  )

  onMounted(() => {
    startAutoplay()
  })

  onBeforeUnmount(() => {
    clearAutoplayInterval()
    clearResumeTimeout()
  })

  return {
    partners,
    currentIndex,
    currentPartner,
    logoErrors,
    goToPartner,
    nextPartner,
    prevPartner,
    markLogoError
  }
}
