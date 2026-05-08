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
        marine: {
          50:  '#e8f4ff', 100: '#d0e8ff', 200: '#a8d0ff',
          300: '#70aeff', 400: '#3882ff', 500: '#0858e8',
          600: '#0040cc', 700: '#0030aa', 800: '#00268a',
          900: '#001e72', 950: '#000f40',
        },
        sonar: { DEFAULT: '#00ff88', dim: '#00cc66', dark: '#003320' },
        aero:  { chrome: '#c8e8ff', shine: '#f0faff' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Nunito"', 'sans-serif'],
        mono:    ['"Courier New"', 'Courier', 'monospace'],
      },
      backgroundImage: {
        'ocean-deep':  'linear-gradient(180deg, #000f40 0%, #002f45 30%, #004d6e 60%, #0072a0 100%)',
        'aqua-gloss':  'linear-gradient(180deg, #8ee8ff 0%, #2bc4f0 40%, #0096d0 50%, #00b4e8 75%, #0084c0 100%)',
        'glass-shine': 'linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(100,200,255,0.06) 60%, rgba(0,80,160,0.1) 100%)',
        'sonar-bg':    'radial-gradient(circle, #001a0d 0%, #000d07 70%, #000804 100%)',
      },
      boxShadow: {
        aero:        '0 8px 32px rgba(0,40,100,0.45), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,100,200,0.2)',
        'aero-glow': '0 0 40px rgba(0,176,232,0.35), 0 8px 32px rgba(0,40,100,0.45), inset 0 1px 0 rgba(255,255,255,0.5)',
        aqua:        '0 0 20px rgba(0,200,255,0.4), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)',
        sonar:       '0 0 30px rgba(0,255,100,0.2), inset 0 0 40px rgba(0,80,40,0.15)',
        'rarity-legendary': '0 0 20px rgba(245,158,11,0.6)',
        'rarity-epic':      '0 0 15px rgba(168,85,247,0.5)',
        'rarity-rare':      '0 0 12px rgba(59,130,246,0.4)',
      },
      animation: {
        'sonar-sweep':    'sonar-sweep 3s linear infinite',
        'sonar-ping':     'sonar-ping 2.4s ease-out infinite',
        'sonar-ping-2':   'sonar-ping 2.4s ease-out 0.8s infinite',
        'sonar-ping-3':   'sonar-ping 2.4s ease-out 1.6s infinite',
        'bubble-rise':    'bubble-rise 8s ease-in infinite',
        'light-ray':      'light-ray 5s ease-in-out infinite',
        'scan-bar':       'scan-bar 1.8s linear infinite',
        'terminal-blink': 'terminal-blink 0.9s step-start infinite',
        'float-gentle':   'float-gentle 4s ease-in-out infinite',
        'data-scroll':    'data-scroll 18s linear infinite',
        'ripple':         'ripple 1.6s ease-out infinite',
        'xp-flash':       'xp-flash 0.6s ease-out',
        'glitch':         'glitch 4s infinite',
        'fade-in-up':     'fade-in-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
      },
      keyframes: {
        'sonar-sweep': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'sonar-ping': {
          '0%':   { transform: 'scale(0.05)', opacity: '0.9' },
          '100%': { transform: 'scale(1)',    opacity: '0' },
        },
        'bubble-rise': {
          '0%':   { transform: 'translateY(0) translateX(0)',   opacity: '0.7' },
          '25%':  { transform: 'translateY(-25vh) translateX(8px)' },
          '50%':  { transform: 'translateY(-50vh) translateX(-6px)', opacity: '0.4' },
          '75%':  { transform: 'translateY(-75vh) translateX(5px)' },
          '100%': { transform: 'translateY(-105vh) translateX(0)', opacity: '0' },
        },
        'light-ray': {
          '0%, 100%': { opacity: '0.04', transform: 'scaleX(1)' },
          '50%':      { opacity: '0.14', transform: 'scaleX(1.15)' },
        },
        'scan-bar': {
          '0%':   { top: '-6%' },
          '100%': { top: '106%' },
        },
        'terminal-blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'data-scroll': {
          from: { transform: 'translateY(0)' },
          to:   { transform: 'translateY(-50%)' },
        },
        'ripple': {
          '0%':   { transform: 'scale(0)', opacity: '0.8' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'xp-flash': {
          '0%':   { transform: 'scale(1)',    color: '#fff' },
          '50%':  { transform: 'scale(1.25)', color: '#00ff88' },
          '100%': { transform: 'scale(1)',    color: '#00ff88' },
        },
        'glitch': {
          '0%, 92%, 100%': { transform: 'translateX(0)',  filter: 'none' },
          '93%':           { transform: 'translateX(-3px)', filter: 'hue-rotate(90deg)' },
          '94%':           { transform: 'translateX(3px)',  filter: 'hue-rotate(-90deg)' },
          '95%':           { transform: 'translateX(0)',    filter: 'none' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
