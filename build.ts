import * as esbuild from 'esbuild';
import path from 'node:path';

import postcss from 'postcss';
import postcssLit from 'postcss-lit';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

const tailwindLit: esbuild.Plugin = {
	name: 'tailwind-lit',
	setup(build) {
		build.onLoad({ filter: /\.ts$/ }, async (args) => {
			const file = Bun.file(args.path);
			const source = await file.text();

			try {
				const result = await postcss([tailwindcss({ config: './tailwind.config.js' }), autoprefixer]).process(source, {
					from: args.path,
					to: path.join('.tmp', 'js', path.basename(args.path)),
					syntax: { parse: postcssLit.parse },
					parser: postcssLit.parse,
					stringifier: postcssLit.stringify,
				});
				return {
					contents: result.content,
					loader: 'ts',
				};
			} catch (error) {
				console.log(error);
			}

			return {
				contents: '',
				loader: 'ts',
			};
		});
	},
};

const injectStyles: esbuild.BuildOptions = {
	entryPoints: ['ui/static/ts/index.ts'],
	outdir: 'public',
	format: 'esm',
	minify: true,
	plugins: [tailwindLit],
};

const result = await esbuild.build(injectStyles);
if (result.errors.length > 0) {
	console.log(result.errors);
}
