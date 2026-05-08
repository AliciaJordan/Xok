/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50:  '#edfafe',
          100: '#d0f4fc',
          200: '#a7eaf8',
          300: '#6ddaf3',
          400: '#2bbfe6',
          500: '#0fa3cc',
          600: '#0e82aa',
          700: '#126889',
          800: '#175571',
          900: '#184760',
          950: '#0b2d41',
        },
        seafoam: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        coral: {
          400: '#fb7185',
          500: '#f43f5e',
        },
        sand: {
          100: '#fef9ee',
          200: '#fdedc8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Nunito"', 'sans-serif'],
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(180deg, #0b2d41 0%, #175571 40%, #0e82aa 100%)',
        'wave-gradient': 'linear-gradient(135deg, #0fa3cc 0%, #175571 50%, #0b2d41 100%)',
      },
      animation: {
        wave: 'wave 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':       { transform: 'translateY(-8px) rotate(1deg)' },
          '66%':       { transform: 'translateY(4px) rotate(-1deg)' },
        },
      },
    },
  },
  plugins: [],
}
