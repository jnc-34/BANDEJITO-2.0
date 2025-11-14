/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 1. Busca en la raíz del proyecto (donde está index.html, App.tsx, etc.)
    "./index.html",
    "./*.{js,ts,jsx,tsx}", // Añade la búsqueda en archivos de la raíz
    
    // 2. Busca SOLAMENTE dentro de la carpeta 'src'
    // Esto excluye node_modules y otros directorios grandes automáticamente.
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}