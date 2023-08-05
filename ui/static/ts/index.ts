import { toPng } from "html-to-image";
import Sortable from "sortablejs";
import htmx from "htmx.org";
import { marked } from "marked";
import DOMPurify from "dompurify";

export function markdown(s: string) {
	return DOMPurify.sanitize(
		marked.parse(s, { headerIds: false, mangle: false }),
	);
}

const downloadend = new Event("downloadend");

export async function downloadChart() {
	const button = document.getElementById(
		"download-button",
	) as HTMLButtonElement;
	const chart = document.getElementById("chart") as HTMLDivElement;
	const dataUrl = await toPng(chart);
	const link = document.createElement("a");

	// Some older browsers may not fully support downloading
	if (typeof link.download !== "string") {
		window.open(dataUrl);
		button.dispatchEvent(downloadend);
		return "ok";
	}
	link.href = dataUrl;
	link.download = "chartsy.png";
	link.click();

	button.dispatchEvent(downloadend);
	return "ok";
}

(window as any).markdown = markdown;
(window as any).downloadChart = downloadChart;

htmx.onLoad(function(content) {
	var sortables = content.querySelectorAll(".sortable");

	for (var i = 0; i < sortables.length; i++) {
		var sortable = sortables[i];

		new Sortable(sortable as HTMLElement, {
			animation: 300,
			ghostClass: "ghost-album",
			invertSwap: true,
		});
	}
});

/*
import Alpine from 'alpinejs';
var panzoom = require('panzoom')

window.Alpine = Alpine;

var element = document.getElementById('scene')
panzoom(element)


Alpine.start();
*/
