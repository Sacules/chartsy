import { toPng } from "html-to-image";
import Sortable from "sortablejs";
import htmx from "htmx.org";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Components
import "./components/input";

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

htmx.onLoad(function (content) {
  var chart = content.querySelector("#images");
  if (!chart) {
    return;
  }

  new Sortable(chart as HTMLElement, {
    animation: 300,
    ghostClass: "ghost-album",
    invertSwap: true,
  });
});

(window as any).markdown = markdown;
(window as any).downloadChart = downloadChart;

/*
import Alpine from 'alpinejs';
var panzoom = require('panzoom')

window.Alpine = Alpine;

var element = document.getElementById('scene')
panzoom(element)


Alpine.start();
*/
