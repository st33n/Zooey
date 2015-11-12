import d3 from 'd3';
import Rx from 'rx';
import { drags, zooms, model, visibleNodes } from './intercom';
import { x, y } from './searchspace';

let zoom_behavior = d3.behavior.zoom();

let current_translate;

/** Eventstream that enriches with visibility info */
Rx.Observable.combineLatest(
  zooms.debounce(300), model,
  function(zs, md) {
    return md.filter(function(node) {
      return true; // node.get("w") > 10 || node.get("fontSize");
    });
  }).subscribe(visibleNodes);

export function create(svg) {
  let zb = zoom_behavior.x(x).y(y);
  zb.on("zoom", evt => { if (!current_translate) zooms.onNext(d3.event); });
  svg.call(zb);

  // Initial zoom
  zooms.onNext({ translate: [ 0, 0 ], scale: 1 });
};

drags.subscribe(function(d) {
  if (d.op === 'start') {
    current_translate = [ zoom_behavior.translate()[0], zoom_behavior.translate()[1] ];
  }
  else if (d.op === 'end') {
    zoom_behavior.translate(current_translate);
    current_translate = null;
  }
});

