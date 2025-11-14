import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🟢 RUTA BASE DEFINITIVA para GitHub Pages
  base: '/BANDEJITO-2.0/', 
  
  // ¡ELIMINAR cualquier configuración de 'build' compleja para evitar conflictos!
});