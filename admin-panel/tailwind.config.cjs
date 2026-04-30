/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7ed',
          100: '#e9f5db',
          200: '#d3e9b7',
          300: '#bdde93',
          400: '#a7d26f',
          500: '#5d8736', 
          600: '#4d6f2c',
          700: '#3d5823',
          800: '#2d411a',
          900: '#1d2a11',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
