// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  base: '/BANDEJITO-2.0/', 
  
  // 🟢 CONFIGURACIÓN PARA FORZAR LA SALIDA .js
  build: {
    rollupOptions: {
      input: {
        main: 'index.tsx', // Indica que el punto de entrada es index.tsx
      },
    },
    // Esto asegura que la salida sea un archivo .js que el navegador reconocerá.
    // Aunque esta configuración es avanzada, ayuda a que Rollup maneje el punto de entrada.
  }
});