import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      'm1-web.jdog.cloud',
      'localhost',
      '127.0.0.1',
      '.jdog.cloud' // jdog.cloud 서브도메인 전체 허용
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})