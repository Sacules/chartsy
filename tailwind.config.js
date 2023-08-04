/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["ui/**/*.{css,html}"],
	theme: {
		extend: {
			fontFamily: {
				"sans-serif": ["'Sofia Sans'", "sans-serif"],
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
