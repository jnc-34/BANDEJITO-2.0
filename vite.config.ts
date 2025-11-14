import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Mantenemos solo la ruta base para GitHub Pages
  base: '/BANDEJITO-2.0/', 
  
  // CORRECCIÓN: Le decimos a Rollup/Vite que el punto de entrada es el archivo HTML,
  // y él encontrará el script 'index.js' referenciado dentro de él.
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
});