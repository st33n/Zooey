import Rx from 'rx'
import d3 from 'd3'
import { drags$ } from './intercom'
import { WIDTH, HEIGHT } from './util'

export const force = d3.layout.force()
  .charge(-250)
  .chargeDistance(2000)
  .linkDistance(60) // (link, index) => (link.rank + 1) * 40)
  .linkStrength(1) // (link, index) => 1 / (link.rank + 1))
  .gravity(0.1)
  .size([ WIDTH, HEIGHT ])

window.force = force
/*
force.on('tick', () => {
  d3.selectAll('svg g.nodes .node')
    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
//    .call(force.drag)
})
*/

force.drag().on('dragend', d => {
  d.fixed = true
  drags$.onNext({ op: 'end', data: d })
}).on('dragstart', d => {
  drags$.onNext({ op: 'start', data: d })
}).on('drag', d => {
  drags$.onNext({ op: 'update', data: d })
})

