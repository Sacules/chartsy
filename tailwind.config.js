const { tailwindTransform } = require("postcss-lit");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: ["ui/**/*.{ts,css,html}"],
    transform: {
      ts: tailwindTransform,
    },
  },
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
