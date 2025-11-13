import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 1. Corregimos la ruta base para que apunte al repositorio:
  base: '/BANDEJITO-2.0/', 
  
  // 2. Definimos las variables de entorno que Vite debe inyectar en el código:
  define: {
    'process.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  }
});