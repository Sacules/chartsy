import * as htmlToImage from "html-to-image";
import Sortable from "sortablejs";
import yabbcode from "ya-bbcode";
import htmx from "htmx.org";

const parser = new yabbcode();

export function bbcode(s: string) {
	return parser.parse(s);
}

export function downloadChart() {
	const chart = document.getElementById("chart") as HTMLDivElement;
	htmlToImage.toPng(chart).then(function(dataUrl) {
		const link = document.createElement("a");
		// Some older browsers may not fully support downloading
		if (typeof link.download !== "string") {
			window.open(dataUrl);
			return;
		}

		link.href = dataUrl;
		link.download = "chartsy.png";
		link.click();
	});
}

(window as any).bbcode = bbcode;
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