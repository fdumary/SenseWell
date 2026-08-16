/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          // Garden / Focus View Greens & Lilacs
          gardenBg: '#446637',
          gardenHeader: '#D5E8D2',
          gardenHeaderBorder: '#BCDAB8',
          moodBarBg: '#DDD7ED',
          moodBarBorder: '#CBC3E3',
          startBtnBg: '#E8D7F2',
          startBtnHover: '#DFC8EC',
          startBtnText: '#352945',

          // Focus Session Modal Ice Blue & Lavender
          focusSkyTop: '#BEDBBA',
          focusSkyBottom: '#476839',
          focusCardBg: '#DDF0F7',
          focusCardBorder: '#B8D6E6',
          focusTimerText: '#223D29',
          focusPauseBg: '#DEC7EB',
          focusPauseHover: '#CFB5DF',
          focusPauseText: '#3D2852',
          focusSpeechBubble: '#E5DAF2',

          // Stats View Blush Pink & Mint Cards
          statsBg: '#F8D7DF',
          statsCardBg: '#D2EBD2',
          statsCardBorder: '#B5DCB5',
          statsProgressFill: '#4D7C54',
          statsProgressTrack: '#E4F5E4',

          // Companion View Lilac & Buttercream Cards
          companionBg: '#D6C8E6',
          companionCardBg: '#F9E8B6',
          companionCardBorder: '#ECD59B',
          companionStatBoxBg: '#D4E9F5',
          companionStatBoxBorder: '#B8DAED',

          // Break Modal Mint
          breakModalBg: '#D8EBD6',
          breakModalBorder: '#B8DCB6',
          breakBtnPrimary: '#EAF5E8',
          breakBtnSecondary: '#FAF6EE',
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
