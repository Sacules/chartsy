module.exports = {
  mode: "jit",
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      gridTemplateColumns: {
        layout: "250px 1fr",
      },
      gridTemplateRows: {
        layout: "3rem 10rem 1fr",
      },
    },
  },
  plugins: [],
};
