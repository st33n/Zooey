var Links = (function (my, Intercom, d3) {
  "use strict";

  var links = [];

  var linkColor = function(data) {
    var src = data.source && data.source.project_type && data.source.project_type.color;
    var trg = data.target && data.target.project_type && data.target.project_type.color;
    return data.rank === 0 ? (src || trg || "#00f") : "#999";
  };

  my.add = function(source, target, rank) {
    var link = { source: source, target: target, rank: rank };
    links.push(link);

    d3.select("svg g.links").selectAll(".link").data(links).enter().append("line")
          .attr("class", function(d) { return "link rank" + d.rank; })
          .style("stroke", linkColor);

    Intercom.links.push(links);
  };

  Intercom.tickers.push(function() {
    d3.select("svg g.links").selectAll(".link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  });

  return my;
}(Links || {}, Intercom, d3));


