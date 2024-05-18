/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Types
import { ImageTextUpdate, ImageTextPlacement, Image } from './components/image';

const downloadend = new Event('downloadend');

function downloadChart(dataUrl: string) {
	const button = document.getElementById('download-button') as HTMLButtonElement;
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

window.downloadChart = downloadChart;

// Make it global so it can be accessed from the chart code
window.imageSearchData = undefined;

type ImageSearchData = {
	Url: string;
	Title: string;
	Caption: string;
}

declare global {
	interface Window {
		downloadChart: typeof downloadChart;
		imageSearchData?: ImageSearchData;
	}

	interface HTMLElementEventMap {
		'chart:update': CustomEvent<ImageTextUpdate>;
		'chart:replace': CustomEvent<Image>;
		'chart:textplacement': CustomEvent<ImageTextPlacement>;
		'chart:title': CustomEvent<{ value: string }>;
	}
}
