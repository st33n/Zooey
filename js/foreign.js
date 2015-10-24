var Foreign = (function(my, Intercom, d3, Bacon) {
  "use strict";

  var elements = function() {
    return d3.select("svg g.nodes g.content_layer").selectAll(".foreignnode");
  };

  Intercom.visibleNodes.onValue(function(visibleNodes) {
    var g = elements().data(
      visibleNodes.filter(function(node) { return node.get("type") === "html"; }).toArray()
    ).enter().append("g")
        .attr("class", "node foreignnode")
        .attr("transform", function(d) { return "translate(" + d.get("x") + "," + d.get("y") + ")"; });

    var fo = g.append("svg:foreignObject")
      .attr("transform", "translate(15, -18) scale(0.1)")
      .attr("height", function(d) { return d.get("h"); })
      .attr("width", function(d) { return d.get("w"); });

    var div = fo.append("xhtml:body")
      .append("xhtml:div")
      .each(function(data) {
        $(this).append(_.template($(data.get("story")).text(), data));
      });
  });

  return my;
}(Foreign || {}, Intercom, d3, Bacon));

