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
		build.onLoad({ filter: /\.js$/ }, async (args) => {
			const source = await fs.promises.readFile(args.path, 'utf8');
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
				loader: 'js',
			};
		});
	},
};

const tsToJs = {
	entryPoints: ['ui/static/ts/index.ts'],
	outfile: '.tmp/index.js',
	format: 'esm',
	bundle: true,
	minify: false,
	plugins: [tsc()],
};

const jsInsertSyles = {
	entryPoints: ['.tmp/index.js'],
	outfile: 'public/index.js',
	minify: true,
	plugins: [tailwindLit],
};

const tailwindStyles = {
	entryPoints: ['ui/static/css/index.css'],
	outdir: 'public',
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
	await esbuild.build(tsToJs);
	await esbuild.build(jsInsertSyles);
} else {
	let tailwindCtx = await esbuild.context(tailwindStyles);
	let tsCtx = await esbuild.context(tsToJs);
	let jsCtx = await esbuild.context(jsInsertSyles);

	tsCtx.watch();
	jsCtx.watch();
	tailwindCtx.watch();
}
