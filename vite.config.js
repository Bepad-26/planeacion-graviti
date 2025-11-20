import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'pdfjs': ['pdfjs-dist/build/pdf.mjs'],
          'xlsx': ['xlsx'],
          'vendor': ['react', 'react-dom', '@heroicons/react'],
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
})
