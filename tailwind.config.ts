import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F9F5EA',
        ink: '#211d16',
        'ink-soft': '#6f6a5c',
        'ink-faint': '#a29c8a',
        line: '#e6dfcd',
        accent: '#F38338',
        'accent-dark': '#D96A22',
        'accent-soft': '#FBE4D0',
        danger: '#d3542f',
        surface: '#FFFEFA',
        'surface-2': '#F1EAD6',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        rise: 'rise .38s ease',
        shake: 'shake .32s',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
