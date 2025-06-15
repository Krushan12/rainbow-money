import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwind(),
  ],
  server: {
    port: 5173,
    // Enable SPA fallback for development
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:5173'
    }
  },
  build: {
    outDir: 'dist',
    // Generate SPA fallback for production build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
