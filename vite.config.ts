import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Mantenemos solo la ruta base para GitHub Pages
  base: '/BANDEJITO-2.0/', 
  
  // 🟢 CORRECCIÓN DEFINITIVA: Forzar la resolución del script de entrada con la extensión correcta.
  build: {
    rollupOptions: {
      input: {
        main: './index.jsx', // ¡Usamos la extensión real!
      },
    },
  },
});