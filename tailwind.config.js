/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["ui/**/*.{css,html}"],
  theme: {
    extend: {
      fontFamily: {
        "sans-serif": ["'Sofia Sans'", "sans-serif"],
        condensed: ["'Sofia Sans Condensed'", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
