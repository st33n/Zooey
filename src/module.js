/* @flow */
import _ from 'underscore';
import $ from 'jquery';
import 'rx-jquery';
import d3 from 'd3';
import { state$, zooms } from './intercom';

const elements = () => d3.select("svg g.nodes g.content_layer").selectAll(".module");

state$.subscribe((state) => {
  const { nodes } = state

  let g = elements().data(nodes.filter(node => node.type === "module"))
    .enter().append("g")
      .attr("class", "node module")
      .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

  let fo = g.append("svg:foreignObject")
    .attr("transform", "translate(15, -18) scale(0.1)")
    .attr("height", d => d.h)
    .attr("width", d => d.w);

  fo.each(function(data) {
    $(this).on("click", function(e) {
      console.log("Click!", e);
      e.preventDefault();
    });

    if (data.source) {
      $(this).append("<pre>\n" + data.source + "/n</pre>");
    }

  });
});

export const tick = (force: any): void =>
  elements().attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')// .call(force.drag)

zooms.debounce(100).subscribe((z) => {
  const { translate, scale } = z

})

