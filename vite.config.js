import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@services': '/src/services',
      '@components': '/src/components'
    }
  },
  // Pour LowDB dans le navigateur
  define: {
    global: 'globalThis',
  }
})