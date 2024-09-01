/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { create, download } from './chart';
import type { Chart } from './chart';

type ImageSearchData = {
	Url: string;
	Title: string;
	Caption: string;
};

window.chart = undefined;
window.chartCreate = create;
window.chartDownload = download;

// Make it global so it can be accessed from the chart code
window.imageSearchData = undefined;

declare global {
	interface Window {
		chart?: Chart;
		chartDownload: typeof download;
		chartCreate: typeof create;
		imageSearchData?: ImageSearchData;
	}

	interface HTMLElementEventMap {
		'chart:title': CustomEvent<{ value: string }>;
	}
}
