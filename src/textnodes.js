import { visibleNodes, zooms } from './intercom';

const color = d3.scale.category20();

let group = 0;

let elements = () => d3.select("svg g.nodes g.overlay_layer").selectAll(".textnode");

let textBox = function(gs, text, fontSize, fill, color, radius) {
  const t = gs.append("svg:text")
      .style("font-size", fontSize)
      .attr("fill", color).text(text);
  t.each(function(d, i) {
    let tx = d3.select(this);
    const bb = this.getBBox();
    const tw = bb.width;
    const th = bb.height;
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

visibleNodes.subscribe(visibleNodes => {
  const g = elements().data(
    visibleNodes.filter(node => node.get("type") === 'text').toArray()
  ).enter().append("g")
      .attr("class", "node textnode")
      .attr("transform", d => "translate(" + d.get("x") + "," + d.get("y") + ")" );

  textBox(g,
      d => d.get("text"), d => d.get("fontSize") || "10px",
      "yellow", "black", 3);

  g.append("title").text(d => d.get("text"));
});

zooms.subscribe(event => {
  let op = (24 - (event.scale - 6)) / 24;
  if (op > 1) op = 1;
  if (op < 0) op = 0;
  elements().attr("opacity", op);
});

