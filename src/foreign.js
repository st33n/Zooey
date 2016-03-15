/* @flow */
import _ from 'underscore';
import $ from 'jquery';
import 'rx-jquery';
import d3 from 'd3';
import { state$ } from './intercom'

let elements = () => d3.select("svg g.nodes g.content_layer").selectAll(".foreignnode");

state$.subscribe((state) => {
  const { nodes } = state

  let g = elements().data(
    nodes.filter(node => node.get("type") === "html").toArray()
  ).enter().append("g")
      .attr("class", "node foreignnode")
      .attr("transform", d => "translate(" + d.get("x") + "," + d.get("y") + ")");

  let fo = g.append("svg:foreignObject")
    .attr("transform", "translate(15, -18) scale(0.1)")
    .attr("height", d => d.get("h"))
    .attr("width", d => d.get("w"));

  fo.each(function(data) {
    $(this).on("click", function(e) {
      console.log("Click!", e);
      e.preventDefault();
    });

    if (data.get("story")) {
      $(this).append(_.template($(data.get("story")).text(), data));
    }

    /*
    else if (data.get("wiki")) {
      $.getJSON("/wiki/" + data.get("wiki")).then(d => {
        for (var page in d.query.pages) {
          $(this).append(d.query.pages[page].revisions[0]['*']);
        }
      });
    }*/
    else if (data.get("wikipedia")) {
      $.get("/wikipedia/" + data.get("wikipedia"))
        .done(d => {
          $(this).append(d);
        }).fail(e => {
          $(this).append(e);
        });
    }
  });
});

