import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// vite.config.ts
export default defineConfig({
  // ...
  base: '/BANDEJITO-2.0/', // Necesario para el workflow de GH Actions
});