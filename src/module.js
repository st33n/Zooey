/* @flow */
import _ from 'underscore';
import $ from 'jquery';
import Rx from 'rx';
import 'rx-jquery';
import d3 from 'd3';
import { state$, zooms } from './intercom';
import { textBox, visibleNodes } from './util';

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

  textBox(g, d => d.name, '10px', 3)

  const contentScale = Math.max(Math.min(1 - scale / 8, 0.8), 0.2)
  selection.selectAll('rect,text').transition().duration(400).ease('cubic-out')
    .attr('transform', `scale(${contentScale})`)

  const fo = selection.selectAll('foreignObject')
    .data(d => d.attachments.filter(a => a === 'source').map(a => d))

  fo.enter().append("svg:foreignObject")
    .attr('transform', 'scale(0) translate(-200, -300)')
    .attr("width", 400)
    .attr("height", 600)
    .each(function(data) {
      $(this).append(
        `<div class='source'><h1>${data.name}</h1><pre>${data.source}</pre></div>`)
    })
    .transition().duration(500)
    .attr('transform', 'scale(0.1) translate(-200, -300)')

  fo.exit()
    .transition().duration(300)
    .attr('transform', 'scale(0) translate(-200, -300)')
    .remove()
}

export const tick = (force: any): void =>
  elements().attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')// .call(force.drag)

Rx.Observable.combineLatest(
  zooms.debounce(100), state$,
  (z, state) => {
    const { translate, scale } = z
    const visible = visibleNodes(d3.select('svg').node(), ".module")
    state.nodes.forEach((s) => { s.attachments = ["title"] })
    if (scale > 5) {
      visible.forEach((v) => { v.attachments = ["source", "title"] })
    }
    update(state, scale)
    /*
    elements().data(state.nodes.filter(node => node.type === "module"))
      .select("foreignObject").data(d => d.attachments).enter()
        attr("height", d => d.visibility * 500 + 100)
       */
  }).subscribe()

