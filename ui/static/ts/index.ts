/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { render, download } from './chart';

window.chartRender = render;
window.chartDownload = download;

// Make it global so it can be accessed from the chart code
window.imageSearchData = undefined;

type ImageSearchData = {
	Url: string;
	Title: string;
	Caption: string;
};

declare global {
	interface Window {
		chartDownload: typeof download;
		chartRender: typeof render;
		imageSearchData?: ImageSearchData;
	}

	interface HTMLElementEventMap {
		'chart:title': CustomEvent<{ value: string }>;
	}
}
