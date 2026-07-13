import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss(),],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/interface': fileURLToPath(new URL('./src/interface', import.meta.url)),
      '@/modules': fileURLToPath(new URL('./src/modules', import.meta.url))
    }
  },
  build: {
    // Los vendors cambian poco entre despliegues: separarlos mejora el cache del navegador
    // y permite descargas en paralelo, sin mezclarlos con el código de la app.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('swiper')) return 'vendor-swiper'
          if (id.includes('@iconify')) return 'vendor-iconify'
          if (id.includes('vue-i18n') || id.includes('@intlify')) return 'vendor-i18n'
          if (
            id.includes('/vue-router/') ||
            id.includes('/pinia/') ||
            id.includes('/@vue/') ||
            id.includes('/vue/')
          ) {
            return 'vendor-vue'
          }
          return 'vendor'
        }
      }
    },
    chunkSizeWarningLimit: 800
  }
})
