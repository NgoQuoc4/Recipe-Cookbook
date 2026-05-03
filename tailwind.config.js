/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        brand: {
          primary: '#10b981',
          secondary: '#f59e0b',
          dark: '#1e293b',
        }
      },
    },
  },
  plugins: [],
}
