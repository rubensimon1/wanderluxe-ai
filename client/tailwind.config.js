/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        'luxe-cream': '#faf8f5',  // Crema para modo claro
      },
      // Fuentes que importaremos de Google Fonts
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], // Para títulos elegantes
        sans: ['Lato', 'sans-serif'],           // Para texto legible
      },
      // Animaciones personalizadas
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}