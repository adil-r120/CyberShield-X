/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#000000',
          lighter: '#0a0a0a',
          lightest: '#111111'
        },
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb'
        },
        danger: {
          DEFAULT: '#ef4444',
          dark: '#dc2626'
        },
        success: {
          DEFAULT: '#10b981',
          dark: '#059669'
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      }
    },
  },
  plugins: [],
}
