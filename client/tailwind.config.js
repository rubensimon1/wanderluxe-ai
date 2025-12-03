/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Nuestra paleta de colores personalizada para WanderLuxe
      colors: {
        'luxe-gold': '#D4AF37',   // Dorado metálico
        'luxe-black': '#1a1a1a',  // Negro casi puro (más elegante que #000)
        'luxe-white': '#f5f5f5',  // Blanco humo (menos agresivo que #FFF)
      },
      // Fuentes que importaremos de Google Fonts
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], // Para títulos elegantes
        sans: ['Lato', 'sans-serif'],           // Para texto legible
      }
    },
  },
  plugins: [],
}