import _ from 'underscore';
import $ from 'jquery';
import d3 from 'd3';
import { visibleNodes } from './intercom';

let elements = () => d3.select("svg g.nodes g.content_layer").selectAll(".foreignnode");

visibleNodes.subscribe(visibleNodes => {
  let g = elements().data(
    visibleNodes.filter(node => node.get("type") === "html").toArray()
  ).enter().append("g")
      .attr("class", "node foreignnode")
      .attr("transform", d => "translate(" + d.get("x") + "," + d.get("y") + ")");

  let fo = g.append("svg:foreignObject")
    .attr("transform", "translate(15, -18) scale(0.1)")
    .attr("height", d => d.get("h"))
    .attr("width", d => d.get("w"));

  let div = fo.append("xhtml:body")
    .append("xhtml:div")
    .each(function(data) {
      $(this).append(_.template($(data.get("story")).text(), data));
    });
});

