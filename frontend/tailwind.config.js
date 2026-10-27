/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saathi: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        curry: '#f59e0b',
        leaf: '#10b981',
        sky: '#0284c7',
        clay: '#78350f',
        parchment: {
          50: '#FFFDF9',
          100: '#FAF6EF',
          200: '#F4EBDC',
          300: '#EDE0CA',
        },
        espresso: '#2A1810',
        chocolate: '#341B10',
        caramel: '#C5832B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
