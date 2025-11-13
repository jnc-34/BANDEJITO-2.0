import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🟢 FORZAMOS LA RUTA BASE a la subcarpeta de GitHub Pages
  base: '/BANDEJITO-2.0/' 
});