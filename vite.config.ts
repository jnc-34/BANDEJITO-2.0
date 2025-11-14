import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🟢 SOLUCIÓN DEFINITIVA: Usamos ruta RELATIVA ('./') 
  // para que los estilos y librerías carguen correctamente en GitHub Pages.
  base: './', 
  
  // 2. No se requiere la sección 'define'. 
  // Vite inyecta VITE_API_KEY automáticamente para que se acceda con import.meta.env.VITE_API_KEY.
});