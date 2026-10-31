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
        arcade: {
          bg: '#0a0d14',
          panel: '#111827',
          card: '#161f30',
          border: '#2a3b5c',
          cyan: '#00f2fe',
          pink: '#f72585',
          purple: '#7209b7',
          emerald: '#00ff87',
          amber: '#ffb703',
          red: '#ff0055',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['Impact', 'Trebuchet MS', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 242, 254, 0.45)',
        'neon-pink': '0 0 20px rgba(247, 37, 133, 0.45)',
        'neon-emerald': '0 0 20px rgba(0, 255, 135, 0.45)',
        'neon-amber': '0 0 20px rgba(255, 183, 3, 0.45)',
        'neon-purple': '0 0 25px rgba(114, 9, 183, 0.5)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.3s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
