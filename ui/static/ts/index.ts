/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { toPng } from 'html-to-image';
import Sortable from 'sortablejs';
import htmx from 'htmx.org';
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

htmx.onLoad(function (content) {
	const images = content.querySelector('#images');
	if (!images) {
		return;
	}

	new Sortable(images as HTMLElement, {
		animation: 300,
		ghostClass: 'ghost-album',
		invertSwap: true,
		draggable: '.sortable-item',
	});
});

window.markdown = markdown;
window.downloadChart = downloadChart;

declare global {
	interface HTMLElementEventMap {
		update: CustomEvent<ImageTextUpdate>;
		replace: CustomEvent<Image>;
		textplacement: CustomEvent<ImageTextPlacement>;
	}

	interface Window {
		markdown: typeof markdown;
		downloadChart: typeof downloadChart;
	}
}

/*
import Alpine from 'alpinejs';
var panzoom = require('panzoom')

window.Alpine = Alpine;

var element = document.getElementById('scene')
panzoom(element)


Alpine.start();
*/
