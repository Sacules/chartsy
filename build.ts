import type { BunPlugin, BuildConfig } from 'bun';
import path from 'node:path';
import { env } from 'node:process';

import postcss from 'postcss';
import postcssLit from 'postcss-lit';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

const tailwindLit: BunPlugin = {
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

const injectStyles: BuildConfig = {
	entrypoints: ['ui/static/ts/index.ts'],
	outdir: 'public',
	format: 'esm',
	minify: true,
	plugins: [tailwindLit],
};

const result = await Bun.build(injectStyles);
if (!result.success) {
	console.log(result.logs);
}
