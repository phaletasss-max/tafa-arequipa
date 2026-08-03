/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Geist', 'sans-serif'],
        display: ['Special Elite', 'serif'],
        outfit:  ['Outfit', 'sans-serif'],
      },
      colors: {
        tafa: {
          dark:    '#0a0a0a',
          text:    '#1a1a1a',
          muted:   '#767676',
          prompt:  '#7c3d1a',
          volcán:  '#c0392b',
          lava:    '#e74c3c',
          sillar:  '#fdf6ec',
          andino:  '#27ae60',
          cielo:   '#2980b9',
          oro:     '#f39c12',
        },
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease forwards',
        'fade-in':   'fadeIn 0.5s ease forwards',
        'slide-up':  'slideUp 0.7s cubic-bezier(0.4,0,0.2,1) forwards',
        'counter':   'counter 2s ease-out forwards',
        'float':     'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(40px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      backdropBlur: { '14px': '14px', '20px': '20px' },
      borderRadius: { '44px': '44px' },
      boxShadow: {
        'glass': '0 0 4px 0 rgba(0,0,0,0.15)',
        'glass-btn': '0 0 2px 0 rgba(0,0,0,0.05)',
        'card': '0 8px 32px rgba(0,0,0,0.12)',
        'card-hover': '0 16px 48px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
