/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
          dark: '#1f2937',
          light: '#f9fafb'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite'
      }
    },
  },
  plugins: [],
}
