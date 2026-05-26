/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdfbf7',
          100: '#fcf6e5',
          200: '#f8ebb8',
          300: '#f2da7d',
          400: '#eac248',
          500: '#d4af37', // luxury gold core
          600: '#b89020',
          700: '#957017',
          800: '#775615',
          900: '#614515',
          950: '#38250a',
        },
        slate: {
          850: '#1e293b',
          950: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'premium-hover': '0 8px 32px 0 rgba(139, 92, 246, 0.45)',
      }
    },
  },
  plugins: [],
}
