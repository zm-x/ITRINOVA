/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      filter: {
        'sketch': 'contrast(1.2) brightness(1.1) saturate(0.8)',
      },
      transitionDelay: {
        '1750': '1750ms',
        '1800': '1800ms',
        '2000': '2000ms',
        '2100': '2100ms',
        '2200': '2200ms',
        '2300': '2300ms',
        '2400': '2400ms',
      }
    },
  },
  plugins: [],
}
