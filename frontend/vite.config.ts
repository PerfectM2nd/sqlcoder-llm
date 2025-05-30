import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': 'http://backend:3000',
      '/generate-sql': 'http://backend:3000',
      '/generate-sql-stream': 'http://backend:3000',
    },
  },
})
