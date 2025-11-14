import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🟢 BASE: Usamos la ruta absoluta de GitHub Pages
  base: '/BANDEJITO-2.0/', 
  
  // Mantenemos el input explícito a index.jsx
  build: {
    rollupOptions: {
      input: {
        main: './index.jsx', // Aseguramos que apunte a .jsx
      },
    },
  },
});