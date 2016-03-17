/* @flow */
/*
 * D3+SVG based zoomable search interface
 *
 * Translate from clientX, clientY to in-svg coords:
 * var pt = svg.createSVGPoint()
 * pt.x = clientX; pt.y = clientY
 * translated = pt.matrixTransform(svg.getScreenCTM().inverse())
 *
 * source: http://stackoverflow.com/questions/10298658/mouse-position-inside-autoscaled-svg
 *
 */
import d3 from 'd3'
import $ from 'jquery'
import _ from 'underscore'
import { zooms } from './intercom'
import { WIDTH, HEIGHT, grid } from './util'

let svg
let g_nodes
let visibleRect

export function create(): Node {
  svg = d3.select("#main").append("svg");

  const defs = svg.append('defs')
  defs.append('clipPath').attr('id', 'circularPath').attr('clipPathUnits', 'objectBoundingBox').append('circle').attr('cx', '0.5').attr('cy', '0.5').attr('r', '0.4')
  const gradient = defs.append('radialGradient').attr('id', 'greenGradient').attr('cx', '50%').attr('cy', '50%').attr('fx', '50%').attr('fy', '50%').attr('r', '50%')
  gradient.append('stop').attr('stop-color', 'rgb(154, 254, 46)').attr('offset', '0%')
  gradient.append('stop').attr('stop-color', 'rgb(154, 230, 46)').attr('offset', '100%')

  g_nodes = svg.append('g').attr('class', 'nodes')
  g_nodes.append('g').attr('class', 'background_layer')
  g_nodes.append('g').attr('class', 'links')
  g_nodes.append('g').attr('class', 'content_layer')
  g_nodes.append('g').attr('class', 'overlay_layer')

  grid({ x: 0, y: 0, width: WIDTH, height: HEIGHT }, 1, 'grid')

  return svg
}

zooms.subscribe(function (event) {
  g_nodes.attr('transform', 'translate(' + event.translate[0] + ',' + event.translate[1] + ') ' + 'scale(' + event.scale + ')')
})

