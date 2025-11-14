// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Mantenemos solo la ruta base para GitHub Pages
  base: '/BANDEJITO-2.0/', 

  // 🟢 CORRECCIÓN: Decirle explícitamente a Rollup cuál es el archivo de entrada.
  build: {
    rollupOptions: {
      input: {
        main: 'index.js', // El nuevo nombre del archivo fuente
      },
    },
  },
});