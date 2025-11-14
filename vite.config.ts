import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🟢 BASE: Usamos la ruta RELATIVA ('.') - la más segura para GitHub Pages en subcarpetas.
  base: './', 
  
  // ❌ IMPORTANTE: Eliminamos el bloque 'build.rollupOptions'
  // Dejamos que Vite configure la compilación automáticamente.
});