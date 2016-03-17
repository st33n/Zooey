import d3 from 'd3'
import { drags$, zooms } from './intercom'
import { WIDTH, HEIGHT } from './util'

let zoom_behavior = d3.behavior.zoom()

let current_translate

const x = d3.scale.linear().range([0, WIDTH])
const y = d3.scale.linear().range([0, HEIGHT])

export const create = svg => {
  let zb = zoom_behavior.x(x).y(y)
  zb.on('zoom', evt => { if (!current_translate) zooms.onNext(d3.event) })
  svg.call(zb)

  // Initial zoom
  zooms.onNext({ translate: [ 0, 0 ], scale: 1 })
}

drags$.subscribe(d => {
  if (d.op === 'start') {
    current_translate = [ zoom_behavior.translate()[0], zoom_behavior.translate()[1] ]
  } else if (d.op === 'end') {
    zoom_behavior.translate(current_translate)
    current_translate = null
  }
})

