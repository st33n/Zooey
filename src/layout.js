import Rx from 'rx'
import d3 from 'd3'
import { state$, drags$ } from './intercom'
import { WIDTH, HEIGHT } from './searchspace'

export const force = d3.layout.force()
  .charge(-150)
  .linkDistance((link, index) => (link.rank + 1) * 40)
  .linkStrength((link, index) => 1 / (link.rank + 1))
  .gravity(0.03)
  .size([ WIDTH, HEIGHT ])
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
