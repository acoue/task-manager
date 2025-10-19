/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans: ['Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'],
        // serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        // mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}