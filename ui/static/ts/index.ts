import Sortable from "sortablejs";
import yabbcode from "ya-bbcode";
import htmx from "htmx.org";

const parser = new yabbcode();

export function bbcode(s: string) {
  return parser.parse(s);
}

(window as any).bbcode = bbcode;

htmx.onLoad(function (content) {
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
import html2canvas from 'html2canvas';
import Alpine from 'alpinejs';
var panzoom = require('panzoom')

window.Alpine = Alpine;

var element = document.getElementById('scene')
panzoom(element)

html2canvas(document.body).then(function(canvas) {
	document.body.appendChild(canvas);
});

Alpine.start();
*/
