/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'sagrada-bg': 'var(--sagrada-bg)',
        'sagrada-paper': 'var(--sagrada-paper)',
        'sagrada-purple': 'var(--sagrada-purple)',
        'sagrada-purple-dark': 'var(--sagrada-purple-dark)',
        'sagrada-gold': 'var(--sagrada-gold)',
        'sagrada-gold-hover': 'var(--sagrada-gold-hover)',
      }
    },
  },
  plugins: [],
}
