import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    port: 8781,
    // Allow Cloudflare / tunnel hostnames
    allowedHosts: true,
  },
  preview: {
    port: 8781,
    allowedHosts: true,
  },
})
