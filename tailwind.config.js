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
        garden: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
          bg: '#0a100d',
          card: '#111b16',
          cardHover: '#16231d',
          border: 'rgba(52, 211, 153, 0.15)',
          borderGlow: 'rgba(52, 211, 153, 0.35)',
        },
        sprout: {
          glow: '#4ade80',
          ambient: '#2dd4bf',
          petal: '#f472b6',
          bloom: '#fbbf24',
          night: '#818cf8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(52, 211, 153, 0.2)',
        'glow-md': '0 0 25px -5px rgba(52, 211, 153, 0.3)',
        'glow-lg': '0 0 40px -10px rgba(52, 211, 153, 0.4)',
        'glow-amber': '0 0 25px -5px rgba(251, 191, 36, 0.35)',
        'glow-violet': '0 0 25px -5px rgba(167, 139, 250, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(251, 113, 133, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-gentle': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'sway': 'sway 5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
        },
        sway: {
          '0%': { transform: 'rotate(-2deg)' },
          '100%': { transform: 'rotate(2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
