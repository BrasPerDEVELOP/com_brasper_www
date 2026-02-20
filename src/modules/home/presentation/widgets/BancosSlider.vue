<template>
  <section id="bancos-section" class="relative py-12 bg-white">
    <div class="mx-auto max-w-7xl px-4 text-center">
      <span class="block text-xs font-semibold text-gray-500 uppercase mb-2">
        {{ t('landing_section_banks_title') }}
      </span>
      <h2 class="text-2xl font-bold mb-6">{{ t('landing_section_banks_subtitle') }}</h2>

      <Swiper
        :modules="modules"
        :slides-per-view="5"
        :space-between="20"
        :loop="true"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false
        }"
        :breakpoints="{
          320: { slidesPerView: 2, spaceBetween: 10 },
          575: { slidesPerView: 3, spaceBetween: 15 },
          767: { slidesPerView: 4, spaceBetween: 15 },
          991: { slidesPerView: 4, spaceBetween: 20 },
          1199: { slidesPerView: 5, spaceBetween: 20 },
          1350: { slidesPerView: 5, spaceBetween: 20 }
        }"
        class="py-4"
      >
        <SwiperSlide v-for="(banco, i) in databancos" :key="i" class="flex justify-center">
          <a
            :href="banco.enlace"
            target="_blank"
            rel="noopener noreferrer"
            class="cursor-pointer"
          >
            <img
              :src="banco.img1"
              :alt="banco.nombre"
              class="w-32 h-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
          </a>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { databancos } from '../../domain/data/bancos'

const { t } = useI18n()
const modules = [Autoplay]
</script>
