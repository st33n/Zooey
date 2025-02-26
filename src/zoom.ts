import d3 from 'd3';
import Rx from 'rx';
import { drags, zooms } from './intercom';
import { x, y } from './searchspace';

const zoom = d3.zoom();

let current_translate: [number, number];

export function create(svg) {
  let zb = zoom.x(x).y(y);
  zoom.on("zoom", event => {
    if (!current_translate) {
      zooms.onNext(event);
    }
  });
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

  // Initial zoom
  zooms.onNext({ translate: [ 0, 0 ], scale: 1 });
};

drags.subscribe(function(d) {
  if (d.op === 'start') {
    current_translate = [ zoom.translate()[0], zoom.translate()[1] ];
  }
  else if (d.op === 'end') {
    zoom_behavior.translate(current_translate);
    current_translate = null;
  }
});
