module.exports = {
  syntax: "postcss-lit",
  plugins: {
    tailwindcss: {
      config: "./tailwind.config.js",
    },
    autoprefixer: {},
  },
};
