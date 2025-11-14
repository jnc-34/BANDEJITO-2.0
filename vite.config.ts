import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 1. Corregimos la ruta base para que carguen estilos y librerías en GitHub Pages.
  base: '/BANDEJITO-2.0/', 
  
  // 2. No se requiere la sección 'define'. 
  // Vite inyecta VITE_API_KEY automáticamente para que se acceda con import.meta.env.VITE_API_KEY.
});