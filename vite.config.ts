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
  }
})
