/* @flow */
import _ from 'underscore';
import $ from 'jquery';
import Rx from 'rx';
import 'rx-jquery';
import d3 from 'd3';
import { state$, zooms } from './intercom';
import { Data, textBox, visibleNodes, tickHandlerFor, color } from './util';

const elements = () => d3.select("svg g.nodes g.content_layer").selectAll(".module");

const update = (state, scale: number) => {
  const { nodes } = state
  const selection = elements().data(
    nodes.filter(node => node.type === "module")
  )
  const g = selection.enter().append("g")
    .attr("class", "node module")
    .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

  selection.exit().remove()

  g.append('circle')
    .attr('r', d => Math.log(d.weight + 1) * 3)
    .attr('fill', d => color(d.group))

  textBox(g, d => d.name, '10px', 3)

  const contentScale = Math.max(Math.min(1 - scale / 8, 0.7), 0.2)
  selection.selectAll('rect,text').transition().duration(400).ease('cubic-out')
    .attr('transform', `scale(${contentScale})`)

  const fo = selection.selectAll('foreignObject')
    .data(d => d.attachments.filter(a => a === 'source').map(a => d))

  const foEnter = fo.enter()
    .append("svg:foreignObject")
      .attr('transform', 'scale(0) translate(-200, -300)')
      .attr("width", 400)
      .attr("height", 600)

  // Switch to non-SVG namespace for div element
  const div = foEnter.append(() => document.createElement("div")).attr("class", "source")
  div.append("h1").text(d => d.name)
  div.append("pre").text(d => d.source)

  foEnter.transition().duration(500)
    .attr('transform', 'scale(0.1) translate(-200, -300)')

  fo.exit()
    .transition().duration(300)
    .attr('transform', 'scale(0) translate(-200, -300)')
    .remove()
}

export const tick = tickHandlerFor(elements)

Rx.Observable.combineLatest(
  zooms.debounce(100), state$,
  (z, state) => {
    const { translate, scale } = z
    const visible = visibleNodes(d3.select('svg').node(), ".module")
    state.nodes.forEach((s) => { s.attachments = ["title"] })
    if (scale > 8) {
      visible.forEach((v) => { v.attachments = ["source", "title"] })
    }
    update(state, scale)
    /*
    elements().data(state.nodes.filter(node => node.type === "module"))
      .select("foreignObject").data(d => d.attachments).enter()
        attr("height", d => d.visibility * 500 + 100)
       */
  }).subscribe()

