/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'open-left': 'open-left 1s cubic-bezier(0.7, 0, 0.3, 1) forwards',
        'open-right': 'open-right 1s cubic-bezier(0.7, 0, 0.3, 1) forwards',
      },
      keyframes: {
        'open-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'open-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      colors: {
        primary: {
          50: '#e6eaf2',
          100: '#c2cadf',
          200: '#9aa8c9',
          300: '#7286b3',
          400: '#546da3',
          500: '#365493',
          600: '#2f4d8b',
          700: '#254280',
          800: '#1c3875',
          900: '#0d2660',
          950: '#081a47',
        },
        dark: {
          50: '#1e293b',
          100: '#1a2332',
          200: '#151d2b',
          300: '#111827',
          400: '#0d1320',
          500: '#0a0f1a',
          600: '#070b14',
          700: '#05080f',
          800: '#03050a',
          900: '#020307',
        },
      },
    },
  },
  plugins: [],
}
