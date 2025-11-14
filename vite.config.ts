import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🟢 BASE: Usamos la ruta RELATIVA ('.') para el despliegue en subcarpeta
  base: './', 
  
  // ❌ IMPORTANTE: Eliminamos el bloque 'build' completo
});