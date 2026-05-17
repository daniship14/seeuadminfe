/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'seeu-bg': '#0d0b1e',
        'seeu-surface': '#1a1535',
        'seeu-card': '#1e1a3a',
        'seeu-border': '#2a2550',
        'seeu-pink': '#e8456a',
        'seeu-orange': '#f07f3c',
        'seeu-purple': '#7c3aed',
        'seeu-text': '#c8c4e8',
        'seeu-muted': '#6b6890',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
