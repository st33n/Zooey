/*
 * D3+SVG based zoomable search interface
 *
 * Translate from clientX, clientY to in-svg coords:
 * var pt = svg.createSVGPoint();
 * pt.x = clientX; pt.y = clientY;
 * translated = pt.matrixTransform(svg.getScreenCTM().inverse())
 *
 * source: http://stackoverflow.com/questions/10298658/mouse-position-inside-autoscaled-svg
 *
 */
var SEARCHSPACE = (function (my, Intercom, d3, $, _, Bacon) {
  "use strict";

  var SCALE = 1;
  var GW = 140 * SCALE, MARGIN = 1 * SCALE, GH = GW / 1.618 * SCALE, CELLS = 9;
  
  my.WIDTH = (GW + MARGIN) * CELLS - MARGIN,
  my.HEIGHT = (GH + MARGIN) * CELLS - MARGIN;

  var x = d3.scale.linear().range([0, my.WIDTH]);
  var y = d3.scale.linear().range([0, my.HEIGHT]);

  var IMG_WIDTH = 32 * SCALE, IMG_HEIGHT = 40 * SCALE;

  var svg, g_nodes, g_links;
  var zoom_behavior, current_translate;

  my.screenToClient = function(x, y) {
    var pt = svg.node().createSVGPoint();
    pt.x = x; pt.y = y;
    var translated = pt.matrixTransform(svg.node().getScreenCTM().inverse());
    return translated;
  };

  my.textBox = function(gs, text, fill, color, radius) {
    var t = gs.append("svg:text")
        .style("font-size", 10 * SCALE + "px")
        .attr("fill", color).text(text);
    t.each(function(d, i) {
      var tx = d3.select(this);
      var bb = this.getBBox();
      var tw = bb.width;
      var th = bb.height;
      tx.attr("x", - tw / 2).attr("y", 5 * SCALE);
      d3.select(this.parentNode).insert("rect", "text")
          .attr("x", - (tw + 10 * SCALE) / 2)
          .attr("y", - (th / 2))
          .attr("width", tw + 10 * SCALE)
          .attr("height", th * 1.4)
          .attr("rx", radius).attr("ry", radius)
          .style("fill", fill);
    });
    return t;
  };

  var grid = function(rect, gutter, c) {
    var dx = (rect.width - ((CELLS - 1) * gutter)) / CELLS;
    var dy = (rect.height - ((CELLS - 1) * gutter)) / CELLS;

    for (var i = 0; i < CELLS; ++i) {
      for (var j = 0; j < CELLS; ++j) {
        g_nodes.append("svg:rect")
          .attr("class", c + " " + c + "-" + i + "-" + j)
          .attr("x", rect.x + i * (dx + gutter))
          .attr("y", rect.y + j * (dy + gutter))
          .attr("width", dx).attr("height", dy);
      }
    }
  };

  my.intersectsPerson = function(person) {
    var rect = svg.node().createSVGRect();
    rect.x = person.x; rect.y = person.y;
    rect.width = IMG_WIDTH * SCALE; rect.height = IMG_HEIGHT * SCALE;
    return svg.node().getIntersectionList(rect, svg.node());
  };

  var visibleRect;

  /* Return an array of the data of nodes that intersect the screen rect */
  var visibleData = function() {
    if (!visibleRect) {
        visibleRect = svg.node().createSVGRect();
        visibleRect.x = 30;
        visibleRect.y = 30;
    }
    visibleRect.width = window.innerWidth - 60;
    visibleRect.height = window.innerHeight - 60;
    var visibleNodes = svg.node().getIntersectionList(visibleRect, svg.node());
    return $(visibleNodes).closest(".node").map(function(i, node) {
        return d3.select(node).datum();
      }).get();
  };

  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

  /** Eventstream that enriches with visibility info */
  Intercom.contentZooms.plug(Intercom.zooms.debounce(300).map(function(scale) {
    return {
      scale: scale,
      contentScale: Math.max(Math.min(1 - scale / 8, 1.2), 0.4),
      visible: visibleData()
    };
  }));

  my.startpos = function() {
    return {
      x: Math.random() * (my.WIDTH / 2) + my.WIDTH / 4,
      y: Math.random() * (my.HEIGHT / 2) + my.HEIGHT / 4
    };
  };

  my.drags = new Bacon.Bus();

  my.create = function() {
    d3.selectAll("html,body,#main").attr("style", "height: 100%");
    svg = d3.select("#main").append("svg").attr("style", "width: 100%; height: 100%");
    var defs = svg.append("defs");
    defs.append("clipPath").attr("id", "circularPath")
      .attr("clipPathUnits", "objectBoundingBox")
      .append("circle").attr("cx", "0.5").attr("cy", "0.5").attr("r", "0.4");
    var gradient = defs.append("radialGradient").attr("id", "greenGradient")
      .attr("cx", "50%").attr("cy", "50%").attr("fx", "50%").attr("fy", "50%")
      .attr("r", "50%");
    gradient.append("stop").attr("stop-color", "rgb(154, 254, 46)").attr("offset","0%");
    gradient.append("stop").attr("stop-color", "rgb(154, 230, 46)").attr("offset","100%");

    g_nodes = svg.append("g").attr("class", "nodes");
    g_links = g_nodes.append("g").attr("class", "links");

    grid({ x: 0, y: 0, width: my.WIDTH, height: my.HEIGHT }, MARGIN, "grid");

    /*
    var helpG = svg.append("g").attr("transform", "translate(40,40)");
    helpG.append("rect")
         .attr("width", WIDTH - 80).attr("height", 40).attr("class", "helpbar");
    helpG.append("text").attr("y", 30).attr("class", "helptext").text("Use menubar to search.");
   */

    zoom_behavior = d3.behavior.zoom();
    // FIXME: my.zooms could be created directly from this event source
    svg.call(zoom_behavior.x(x).y(y).on("zoom", function() {
      if (current_translate) return; // dragging...

      g_nodes.attr("transform", 
                 "translate(" + d3.event.translate[0] + "," + d3.event.translate[1] + ") "
                 + "scale(" + d3.event.scale + ")");

      Intercom.zooms.push(d3.event.scale);
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
  };

  return my;
}(SEARCHSPACE || {}, Intercom, d3, $, _, Bacon));

$(function() {
  "use strict";
  SEARCHSPACE.create();
});

