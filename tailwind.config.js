/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.html"],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['cupcake'],
  }
}

