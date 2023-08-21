const { tailwindTransform } = require('postcss-lit');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: {
		files: ['index.ts', './content/**/*.ts', '../../html/**/*.html'],
		transform: {
			ts: tailwindTransform,
		},
	},
	theme: {
		extend: {
			fontFamily: {
				'sans-serif': ["'Sofia Sans'", 'sans-serif'],
				condensed: ["'Sofia Sans Condensed'", 'sans-serif'],
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
