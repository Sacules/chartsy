//import Alpine from 'alpinejs';
import Sortable from 'sortablejs';
//import html2canvas from 'html2canvas';
import 'toolcool-range-slider';
//var panzoom = require('panzoom')

 
window.htmx = require('htmx.org');
//window.Alpine = Alpine;
 
htmx.onLoad(function(content) {
    var sortables = content.querySelectorAll(".sortable");

    for (var i = 0; i < sortables.length; i++) {
      var sortable = sortables[i];

      new Sortable(sortable, {
          animation: 300,
          ghostClass: 'ghost-album',
		  invertSwap: true
      });
    }
});

/*
var element = document.getElementById('scene')
panzoom(element)

html2canvas(document.body).then(function(canvas) {
    document.body.appendChild(canvas);
});

Alpine.start();
*/
