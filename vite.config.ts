import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🟢 BASE: Utilizamos la ruta relativa ('.') para máxima compatibilidad con GitHub Pages
  base: './', 
  
  // 🟢 CORRECCIÓN FINAL: Definimos explícitamente el punto de entrada para Rollup/Vite
  // Esto resuelve el problema de "asset not found" en el despliegue.
  build: {
    rollupOptions: {
      input: {
        main: './index.js', // ¡Debe coincidir con tu archivo renombrado!
      },
    },
  },
});