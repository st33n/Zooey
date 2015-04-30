var TextNodes = (function(my, SEARCHSPACE, Intercom, d3, Bacon) {
  "use strict";

  var color = d3.scale.category20();

  var textnodes = [
    { x: 640, y: 480, text: "Enter the badger", group: 1 }
  ];

  var group = 0;

  var elements = function() {
    return d3.select("svg g.nodes").selectAll(".textnode");
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

  my.init = function() {
    var g = elements().data(textnodes)
        .enter().append("g").attr("class", "node textnode");
    g.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    textBox(g,
        function(d) { return d.text; },
        function(d) { return color(d.group); },
        "white", 5);

    g.append("title").text(function(d) { return d.text; });
    g.append("svg:g").attr("class", "details");

    Intercom.textnodes.push(textnodes);
  };
/*
  Intercom.tickers.push(function() {
    elements().attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
*/
  Intercom.contentZooms.onValue(function(zoom) {
    var nodes = d3.select("svg g.nodes");

    nodes.selectAll(".searchterm").each(function(data) {
      if (zoom.visible.indexOf(data) === -1 || zoom.scale <= 3) {
        data.visibility = 0;
      }
      else if (zoom.scale > 3 && zoom.scale < 7) {
        data.visibility = 1;
      }
      else {
        data.visibility = 2;
      }
    });
    update2(nodes.selectAll(".searchterm .details"));
  });

  var update2 = function(details) {
    var detail = details.selectAll(".detail2").data(function(d) {
      if (d.visibility !== 2) return [];
      return [ d ];
    });

    var enter = detail.enter();
    var fo = enter.append("svg:foreignObject")
      .attr("class", "detail2 searchTerm")
      .attr("transform", "translate(15, -18) scale(0.1)")
      .attr("x", -150).attr("y", 130)
      .attr("height", 50).attr("width", 200);

    var div = fo.append("xhtml:body")
      .append("xhtml:div")
      .each(function(data) {
        $(this).append(_.template($("#searchTermTemplate").text(), data));
      });

    detail.exit().remove();
  };

  return my;
}(TextNodes || {}, SEARCHSPACE, Intercom, d3, Bacon));

$(function() {
  TextNodes.init();
});

