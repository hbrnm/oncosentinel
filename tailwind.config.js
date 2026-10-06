/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7F5',
          100: '#E8EFEA',
          200: '#D2DFD6',
          300: '#B4C9BC',
          400: '#94B2A1',
          500: '#7A9A8B', // Main primary
          600: '#628072',
          700: '#4D665B',
          800: '#3D5248',
          900: '#2A3A32',
        },
        petal: {
          50: '#FDF7F8',
          100: '#FAF0F1',
          200: '#F4DEE1',
          300: '#E8C5C8', // Secondary
          400: '#DBA8AC',
          500: '#CA868C',
          600: '#B0666C',
        },
        peach: {
          50: '#FFF7F3',
          100: '#FEEDDE',
          200: '#FDDBC3',
          300: '#FCC4A2',
          400: '#F8A87C',
          500: '#F3A683', // Alert soft
          600: '#E07A5F',
        },
        darkbg: {
          DEFAULT: '#161E1A',
          surface: '#202B25',
          card: '#293730',
          border: '#374940'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
