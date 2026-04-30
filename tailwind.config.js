/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chess: {
          black: '#0a0a0a',
          dark: '#1a1a1a',
          gray: '#333333',
          light: '#f5f5f5',
          white: '#ffffff',
          accent: '#4f46e5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'chess-pattern': "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M20 20h20v20H20zM0 0h20v20H0z\" fill=\"%231a1a1a\" fill-opacity=\"0.4\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
}
