import d3 from 'd3'
import { visibleNodes, zooms } from './intercom'

let elements = () => d3.select('svg g.nodes g.overlay_layer').selectAll('.army')

visibleNodes.subscribe(visibleNodes => {
  const g = elements().data(
    visibleNodes.filter(node => node.get('type') === 'army').toArray()
  ).enter().append('g')
      .attr('class', 'node army')
      .attr('transform', d => 'translate(' + d.get('x') + ',' + d.get('y') + ')')

  g.append('svg:text')
    .style('font-size', '10px')
    .attr('fill', 'black')
    .text('A')
})

zooms.subscribe(event => {
  let op = (24 - (event.scale - 6)) / 24
  if (op > 1) op = 1
  if (op < 0) op = 0
  elements().attr('opacity', op)
})

