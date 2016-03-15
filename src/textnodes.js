/* @flow */
import d3 from 'd3'
import Rx from 'rx'
import { zooms, state$ } from './intercom'

type Data = { type: string, x: number, y: number, text: string }
type DataFunc<T> = ((d:Data) => T) | T

const elements = () => d3.select('svg g.nodes g.overlay_layer').selectAll('.textnode')

const textBox = function (gs, text: DataFunc<string>, fontSize: DataFunc<string>, radius: DataFunc<number>) {
  const t = gs.append('svg:text')
      .style('font-size', fontSize)
      .text(text)
  t.each(function (d, i) {
    let tx = d3.select(this)
    const bb = this.getBBox()
    const tw = bb.width
    const th = bb.height
    tx.attr('x', -tw / 2).attr('y', 5)
    d3.select(this.parentNode).insert('rect', 'text')
        .attr('x', -(tw + 10) / 2)
        .attr('y', -(th / 2))
        .attr('width', tw + 10)
        .attr('height', th * 1.4)
        .attr('rx', radius).attr('ry', radius)
  })
  return t
}

state$.subscribe((state) => {
  const { nodes } = state
  const g = elements().data(
    nodes.filter(node => node.type === 'text')
  ).enter().append('g')
    .attr('class', d => 'node textnode ' + (d.outdated ? 'outdated' : 'current'))
    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')

  textBox(g, d => d.text, d => d.fontSize || '10px', 3)

  g.append('title').text(d => d.text)
})

export const tick = (force: any): void =>
  elements().attr('transform', d => 'translate(' + d.x + ',' + d.y + ')').call(force.drag)

// Resize based on scale / zoom level
zooms.debounce(300).pluck('scale').map(
  scale => ({
    scale,
    contentScale: Math.max(Math.min(1 - scale / 8, 1.2), 0.4)
  })
).subscribe(event => {
  elements().selectAll('*')
    .transition()
    .duration(400)
    .ease('cubic-out')
    .attr('transform', 'scale(' + event.contentScale + ')')
})

/*
zooms.subscribe(event => {
  let op = (24 - (event.scale - 6)) / 24
  if (op > 1) op = 1
  if (op < 0) op = 0
  elements().attr('opacity', op)
})
*/
