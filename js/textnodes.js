var TextNodes = (function(my, SEARCHSPACE, Intercom, d3, Bacon) {
  "use strict";

  var color = d3.scale.category20();

  var group = 0;

  var elements = function() {
    return d3.select("svg g.nodes g.overlay_layer").selectAll(".textnode");
  };

  var textBox = function(gs, text, fill, color, radius) {
    var t = gs.append("svg:text")
        .style("font-size", "10px")
        .attr("fill", color).text(text);
    t.each(function(d, i) {
      var tx = d3.select(this);
      var bb = this.getBBox();
      var tw = bb.width;
      var th = bb.height;
      tx.attr("x", - tw / 2).attr("y", 5);
      d3.select(this.parentNode).insert("rect", "text")
          .attr("x", - (tw + 10) / 2)
          .attr("y", - (th / 2))
          .attr("width", tw + 10)
          .attr("height", th * 1.4)
          .attr("rx", radius).attr("ry", radius)
          .style("fill", fill);
    });
    return t;
  };

  Intercom.visibleNodes.onValue(function(visibleNodes) {
    var g = elements().data(
      visibleNodes.filter(function(node) { return node.get("type") === 'text' }).toArray()
    ).enter().append("g")
        .attr("class", "node textnode")
        .attr("transform", function(d) { return "translate(" + d.get("x") + "," + d.get("y") + ")"; });

    textBox(g,
        function(d) { return d.get("text"); },
        "yellow",
        "black", 3);

    g.append("title").text(function(d) { return d.get("text"); });
  });

  Intercom.zooms.onValue(function(event) {
    var op = (24 - (event.scale - 6)) / 24;
    if (op > 1) op = 1;
    if (op < 0) op = 0;
    elements().attr("opacity", op);
  });

  return my;
}(TextNodes || {}, SEARCHSPACE, Intercom, d3, Bacon));

