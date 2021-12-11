module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        layout: "250px 1fr",
      },
      gridTemplateRows: {
        layout: "3rem 1fr",
      },
    },
  },
  plugins: [],
};
