var Zoom = (function (my, Intercom, SEARCHSPACE, Model, d3, $, _, Bacon) {
  "use strict";

  var zoom_behavior = d3.behavior.zoom();

  var current_translate;

  my.drags = new Bacon.Bus();

  /** Eventstream that enriches with visibility info */
  Intercom.visibleNodes.plug(Intercom.zooms.debounce(300).map(function(event) {
    return Model.nodes.filter(function(node) {
      console.log(node, node.get("w"));
      return node.get("w") > 10;
    });
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
}(Zoom || {}, Intercom, SEARCHSPACE, Model, d3, $, _, Bacon));


