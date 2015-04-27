var Zoom = (function (my, Intercom, SEARCHSPACE, d3, $, _, Bacon) {
  "use strict";

  var zoom_behavior = d3.behavior.zoom();

  var current_translate;

  my.drags = new Bacon.Bus();

  /** Eventstream that enriches with visibility info */
  Intercom.contentZooms.plug(Intercom.zooms.debounce(300).map(function(scale) {
    return {
      scale: scale,
      contentScale: Math.max(Math.min(1 - scale / 8, 1.2), 0.4),
      visible: SEARCHSPACE.visibleData()
    };
  }));

  // FIXME: my.zooms could be created directly from this event source
  SEARCHSPACE.svg_call(zoom_behavior.x(SEARCHSPACE.x).y(SEARCHSPACE.y).on("zoom", function() {
    if (current_translate) return; // dragging...
    Intercom.zooms.push(d3.event);
  }));

  Intercom.drags.onValue(function(d) {
    if (d.op === 'start') {
      current_translate = [ zoom_behavior.translate()[0], zoom_behavior.translate()[1] ];
    }
    else if (d.op === 'end') {
      zoom_behavior.translate(current_translate);
      current_translate = null;
    }
  });

  return my;
}(Zoom || {}, Intercom, SEARCHSPACE, d3, $, _, Bacon));


