/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        aqua: {
          50:  '#f0fcff', 100: '#dcf8ff', 200: '#b3efff',
          300: '#70e0ff', 400: '#22ccff', 500: '#00b0e8',
          600: '#008ec0', 700: '#0072a0', 800: '#005d84',
          900: '#004d6e', 950: '#002f45',
        },
        ocean: {
          50:  '#e8f4ff', 100: '#cde8ff', 200: '#a0d4f8',
          300: '#6ab8f0', 400: '#3a96e0', 500: '#1878c8',
          600: '#0c60aa', 700: '#084a8a', 800: '#05386e',
          900: '#032854', 950: '#011a38',
        },
        aero:  { chrome: '#d0eaff', shine: '#f4faff', sky: '#a0d4f0' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Nunito"', 'sans-serif'],
        mono:    ['"Courier New"', 'Courier', 'monospace'],
      },
      backgroundImage: {
        'ocean-sky':   'linear-gradient(180deg, #c8eeff 0%, #7ec8f0 40%, #3090d0 100%)',
        'aqua-gloss':  'linear-gradient(180deg, #8ee8ff 0%, #2bc4f0 40%, #0096d0 50%, #00b4e8 75%, #0084c0 100%)',
        'glass-shine': 'linear-gradient(160deg, rgba(255,255,255,0.78) 0%, rgba(220,242,255,0.55) 60%, rgba(180,228,255,0.45) 100%)',
        'ocean-wave':  'radial-gradient(ellipse at 50% 120%, rgba(0,180,255,0.18) 0%, transparent 70%)',
      },
      boxShadow: {
        aero:          '0 8px 32px rgba(30,100,180,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
        'aero-glow':   '0 0 30px rgba(60,160,255,0.22), 0 8px 32px rgba(30,100,180,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
        aqua:          '0 4px 16px rgba(0,140,220,0.35), 0 1px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.85)',
        'rarity-legendary': '0 0 16px rgba(245,158,11,0.4)',
        'rarity-epic':      '0 0 12px rgba(147,51,234,0.3)',
        'rarity-rare':      '0 0 10px rgba(59,130,246,0.25)',
      },
      animation: {
        'sonar-sweep':    'sonar-sweep 5s linear infinite',
        'sonar-ping':     'sonar-ping 3s ease-out infinite',
        'sonar-ping-2':   'sonar-ping 3s ease-out 1s infinite',
        'sonar-ping-3':   'sonar-ping 3s ease-out 2s infinite',
        'bubble-rise':    'bubble-rise 12s ease-in infinite',
        'light-ray':      'light-ray 7s ease-in-out infinite',
        'float-gentle':   'float-gentle 6s ease-in-out infinite',
        'data-scroll':    'data-scroll 24s linear infinite',
        'xp-flash':       'xp-flash 0.7s ease-out',
        'fade-in-up':     'fade-in-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'gentle-shimmer': 'gentle-shimmer 3s ease-in-out infinite',
        'ripple-soft':    'ripple-soft 2s ease-out infinite',
        'scan-bar':       'scan-bar 2.5s ease-in-out infinite',
      },
      keyframes: {
        'sonar-sweep': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'sonar-ping': {
          '0%':   { transform: 'scale(0.1)', opacity: '0.7' },
          '100%': { transform: 'scale(1)',   opacity: '0' },
        },
        'bubble-rise': {
          '0%':   { transform: 'translateY(0) translateX(0)',    opacity: '0.6' },
          '25%':  { transform: 'translateY(-25vh) translateX(6px)' },
          '50%':  { transform: 'translateY(-50vh) translateX(-5px)', opacity: '0.35' },
          '75%':  { transform: 'translateY(-75vh) translateX(4px)' },
          '100%': { transform: 'translateY(-108vh) translateX(0)', opacity: '0' },
        },
        'light-ray': {
          '0%, 100%': { opacity: '0.06', transform: 'scaleX(1)' },
          '50%':      { opacity: '0.18', transform: 'scaleX(1.1)' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'data-scroll': {
          from: { transform: 'translateY(0)' },
          to:   { transform: 'translateY(-50%)' },
        },
        'xp-flash': {
          '0%':   { transform: 'scale(1)',    color: '#1a6090' },
          '50%':  { transform: 'scale(1.2)',  color: '#22a55a' },
          '100%': { transform: 'scale(1)',    color: '#22a55a' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(18px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'gentle-shimmer': {
          '0%, 100%': { opacity: '0.7' },
          '50%':      { opacity: '1' },
        },
        'ripple-soft': {
          '0%':   { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'scan-bar': {
          '0%':   { top: '-6%' },
          '100%': { top: '106%' },
        },
      },
    },
  },
  plugins: [],
}
