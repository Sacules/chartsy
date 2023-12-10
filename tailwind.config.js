const { tailwindTransform } = require('postcss-lit');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: {
		files: ['ui/**/*.{templ,html,ts}'],
		transform: {
			ts: tailwindTransform,
		},
	},
	theme: {
		fontSize: {
			sm: '0.812rem',
			base: '1rem',
			lg: '1.25rem',
			xl: '1.562rem',
			'2xl': '1.938rem',
			'3xl': '2.438rem',
			'4xl': '3.062rem',
			'5xl': '3.812rem',
		},
		extend: {
			fontFamily: {
				'sans-serif': ["'Sofia Sans'", 'sans-serif'],
				condensed: ["'Sofia Sans Condensed'", 'sans-serif'],
			},
		},
	},
	plugins: [],
};
