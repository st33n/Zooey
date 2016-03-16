/* @flow */
import d3 from 'd3'
import Rx from 'rx'
import { zooms, state$ } from './intercom'
import { textBox, tickHandlerFor, dynamicResize } from './util'

const elements = () => d3.select('svg g.nodes g.overlay_layer').selectAll('.textnode')

state$.subscribe((state) => {
  const { nodes } = state
  const g = elements().data(
    nodes.filter(node => node.type === 'text')
  ).enter().append('g')
    .attr('class', d => 'node textnode')
    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')

  textBox(g, d => d.text, d => d.fontSize || '10px', 3)

  g.append('title').text(d => d.text)
})

export const tick = tickHandlerFor(elements)

dynamicResize(elements, 0.2, 0.8)

