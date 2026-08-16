/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        figma: {
          bg: '#FBF8F1',
          bgDarker: '#F3EFE6',
          card: '#FFFDF9',
          cardMuted: '#F6F3EB',
          cardGreen: '#EAF3EB',
          cardGreenHeader: '#DEEBDD',
          border: '#EAE6DC',
          borderMuted: '#E2DDD0',
          forest: '#4A7C59',
          forestHover: '#3D684A',
          forestDark: '#2C4A35',
          sage: '#C2D8B9',
          sageLight: '#EEF4ED',
          lavender: '#A89FDC',
          lavenderHover: '#958ACF',
          lavenderLight: '#F3F0FF',
          blossom: '#F472B6',
          blossomLight: '#FDF2F8',
          blossomBorder: '#FBCFE8',
          terracotta: '#E07A5F',
          terracottaLight: '#FBEBE6',
          sun: '#F59E0B',
          sunLight: '#FEF3C7',
          sky: '#60A5FA',
          skyLight: '#EFF6FF',
          textMain: '#2D3748',
          textMuted: '#718096',
          textSubtle: '#A0AEC0',
          pixelGreen: '#234E32',
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        pixel: ['Silkscreen', 'VT323', 'monospace'],
        display: ['Quicksand', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'figma-card': '0 4px 16px -2px rgba(45, 55, 72, 0.05)',
        'figma-sm': '0 2px 8px -1px rgba(45, 55, 72, 0.06)',
        'figma-button': '0 4px 12px rgba(74, 124, 89, 0.25)',
        'figma-lavender': '0 4px 12px rgba(168, 159, 220, 0.3)',
      },
      animation: {
        'float-gentle': 'float 4s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite alternate',
        'cloud-move': 'cloud 25s linear infinite',
        'flutter': 'flutter 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sway: {
          '0%': { transform: 'rotate(-3deg)' },
          '100%': { transform: 'rotate(3deg)' },
        },
        cloud: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        flutter: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(0.85) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(-5deg)' },
        }
      }
    },
  },
  plugins: [],
}
