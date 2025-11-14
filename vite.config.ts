// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Mantenemos solo la ruta base para GitHub Pages
  base: '/BANDEJITO-2.0/', 

  // 🟢 CORRECCIÓN: Usar la ruta relativa explícita (./)
  build: {
    rollupOptions: {
      input: {
        main: './index.js', // ¡Este punto es crucial en ambientes CI!
      },
    },
  },
});