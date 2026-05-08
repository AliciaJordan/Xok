import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // TF.js loads lazily via dynamic import, but splitting it here
          // ensures the vendor chunk is cached independently of app code.
          tensorflow: ['@tensorflow/tfjs'],
          react:      ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
