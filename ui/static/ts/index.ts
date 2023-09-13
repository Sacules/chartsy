/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { toPng } from 'html-to-image';
import Sortable from 'sortablejs';
import { marked } from 'marked';

// Components
import './components/input';
import './components/image';
import './components/settings/images';

// Types
import { ImageTextUpdate, ImageTextPlacement, Image } from './components/image';

function markdown(s: string) {
	return marked.parse(s);
}

const downloadend = new Event('downloadend');

async function downloadChart() {
	const button = document.getElementById('download-button') as HTMLButtonElement;
	const chart = document.getElementById('chart') as HTMLDivElement;
	const dataUrl = await toPng(chart);
	const link = document.createElement('a');

	// Some older browsers may not fully support downloading
	if (typeof link.download !== 'string') {
		window.open(dataUrl);
		button.dispatchEvent(downloadend);
		return 'ok';
	}
	link.href = dataUrl;
	link.download = 'chartsy.png';
	link.click();

	button.dispatchEvent(downloadend);
	return 'ok';
}

function prepareChart(imgs: HTMLElement) {
	new Sortable(imgs, {
		animation: 300,
		ghostClass: 'ghost-album',
		invertSwap: true,
		draggable: '.sortable-item',
	});
}

window.markdown = markdown;
window.prepareChart = prepareChart;
window.downloadChart = downloadChart;

declare global {
	interface HTMLElementEventMap {
		update: CustomEvent<ImageTextUpdate>;
		replace: CustomEvent<Image>;
		textplacement: CustomEvent<ImageTextPlacement>;
	}

	interface Window {
		markdown: typeof markdown;
		prepareChart: typeof prepareChart;
		downloadChart: typeof downloadChart;
	}
}
