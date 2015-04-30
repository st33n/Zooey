var Foreign = (function(my, Intercom, d3, Bacon) {
  "use strict";

  var foreignnodes = [
    { x: 700, y: 500, w: 800, h: 600,
      src: "file:./index.html",
      story: "#story1",
      group: 1 }
  ];

  var elements = function() {
    return d3.select("svg g.nodes").selectAll(".foreignnode");
  };

  my.init = function() {
    var g = elements().data(foreignnodes)
        .enter().append("g").attr("class", "node foreignnode");
    var fo = g.append("svg:foreignObject")
      .attr("transform", "translate(15, -18) scale(0.1)")
      .attr("height", function(d) { return d.h; })
      .attr("width", function(d) { return d.w; });

    g.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    var div = fo.append("xhtml:body")
      .append("xhtml:div")
      .each(function(data) {
        $(this).append(_.template($(data.story).text(), data));
      });
  };

  return my;
}(Foreign || {}, Intercom, d3, Bacon));

$(function() {
  Foreign.init();
});

