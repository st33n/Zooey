import d3 from 'd3'
import { zooms } from './intercom'

const elements = () => d3.select('svg g.nodes g.content_layer').selectAll('.person')

export const enter = nodes => {
  const g = elements().data(
    nodes.filter(node => node.type === 'person')
  )

  g.enter()
    .append('g').attr('class', 'node person')
    .append('image')
    .attr('xlink:href', d => d.photoUrl.match(/blank/) ? '/img/smile.png' : d.photoUrl)
    .attr('width', 50)
    .attr('height', 50)
    .attr('x', -25)
    .attr('y', -25)
    .style('clip-path', 'url(#circularPath)')

    /*
    .append('svg:text')
    .style('font-size', '10px')
    .attr('fill', 'black')
    .text(d => d.name)
   */

  g.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')

  g.exit().remove()
}

// Resize people based on scale / zoom level
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

export const tick = (force) =>
  elements().attr('transform', d => 'translate(' + d.x + ',' + d.y + ')').call(force.drag)

