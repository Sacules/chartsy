/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { create, download, resize } from './chart';
import type { Chart } from './chart';

type ImageSearchData = {
	Url: string;
	Title: string;
	Caption: string;
};

window.chart = undefined;
window.chartCreate = create;
window.chartResize = resize;
window.chartDownload = download;

// Make it global so it can be accessed from the chart code
window.imageSearchData = undefined;

declare global {
	interface Window {
		chart?: Chart;
		chartDownload: typeof download;
		chartCreate: typeof create;
		chartResize: typeof resize;
		imageSearchData?: ImageSearchData;
	}

	interface HTMLElementEventMap {
		'chart:title': CustomEvent<{ value: string }>;
		'chart:update': CustomEvent<{ name: string; value: number }>;
	}
}
