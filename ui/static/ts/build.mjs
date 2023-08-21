import postcss from 'postcss';
import postcssLit from 'postcss-lit';
import fs from 'node:fs';
import * as esbuild from 'esbuild';
import tsc from 'esbuild-plugin-tsc';
import postcssPlugin from 'esbuild-style-plugin';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import path from 'node:path';
import { env } from 'node:process';

const tailwindLit = {
	name: 'tailwind-lit',
	setup(build) {
		build.onLoad({ filter: /\.ts$/ }, async (args) => {
			const source = await fs.promises.readFile(args.path, 'utf8');
			console.log(args.path);
			let result;
			try {
				result = await postcss([tailwindcss({ config: './tailwind.config.js' }), autoprefixer]).process(source, {
					from: args.path,
					to: path.join('.tmp', 'js', path.basename(args.path)),
					syntax: 'postcss-lit',
					parser: postcssLit.parse,
					stringifier: postcssLit.stringify,
				});
			} catch (error) {
				console.log(error);
			}

			return {
				contents: result.content,
				loader: 'ts',
			};
		});
	},
};

const injectStyles = {
	entryPoints: ['index.ts'],
	outfile: '.tmp/index.ts',
	format: 'esm',
	bundle: true,
	minify: false,
	keepNames: true,
	plugins: [tailwindLit],
};

const tsToJs = {
	entryPoints: ['.tmp/index.ts'],
	outfile: '../../../public/index.js',
	minify: true,
	plugins: [tsc()],
};

const tailwindStyles = {
	entryPoints: ['../css/index.css'],
	outdir: '../../../public',
	bundle: true,
	minify: true,
	plugins: [
		postcssPlugin({
			postcss: {
				plugins: [tailwindcss, autoprefixer],
			},
		}),
	],
};

const isProd = env.BUILD_ENV === 'prod';

if (isProd) {
	await esbuild.build(tailwindStyles);
	await esbuild.build(injectStyles);
	await esbuild.build(tsToJs);
} else {
	let tailwindCtx = await esbuild.context(tailwindStyles);
	let jsCtx = await esbuild.context(injectStyles);
	let tsCtx = await esbuild.context(tsToJs);

	tsCtx.watch();
	jsCtx.watch();
	tailwindCtx.watch();
}
