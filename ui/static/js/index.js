import Sortable from "sortablejs";
import "toolcool-range-slider";

//import html2canvas from 'html2canvas';
//import Alpine from 'alpinejs';
//var panzoom = require('panzoom')

window.htmx = require("htmx.org");

htmx.onLoad(function (content) {
  var sortables = content.querySelectorAll(".sortable");

  for (var i = 0; i < sortables.length; i++) {
    var sortable = sortables[i];

    new Sortable(sortable, {
      animation: 300,
      ghostClass: "ghost-album",
      invertSwap: true,
    });
  }
});

/*
window.Alpine = Alpine;

var element = document.getElementById('scene')
panzoom(element)

html2canvas(document.body).then(function(canvas) {
    document.body.appendChild(canvas);
});

Alpine.start();
*/
