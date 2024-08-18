/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#0D1418',
        'primary': '#1BF1A1',
      },
      fontFamily: {
        'plex-mono': ['"IBM Plex Mono"', 'monospace'],
        'helvetica': ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

