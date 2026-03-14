/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'garden-green': '#2D5A27',
        'garden-brown': '#5C4033',
      }
    },
  },
  plugins: [],
}