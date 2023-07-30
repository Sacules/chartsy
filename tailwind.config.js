/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["ui/**/*.{ts,css,html}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
