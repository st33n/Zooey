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
import _ from 'lodash'
import { zooms } from './intercom'
import { Point, Rectangle } from './types'

const SCALE = 1
const GW = 140 * SCALE
const MARGIN = 1 * SCALE
const GH = GW / 1.618 * SCALE
const CELLS = 9

export const WIDTH = (GW + MARGIN) * CELLS - MARGIN;
export const HEIGHT = (GH + MARGIN) * CELLS - MARGIN;

export const x = d3.scaleLinear().range([0, WIDTH]);
export const y = d3.scaleLinear().range([0, HEIGHT]);

const IMG_WIDTH = 32 * SCALE
const IMG_HEIGHT = 40 * SCALE

export let svg: any;
let g_nodes: any;

let visibleRect: any;

export function screenToClient(x: number, y: number): Point {
  const pt = svg.node().createSVGPoint()
  pt.x = x
  pt.y = y
  return pt.matrixTransform(svg.node().getScreenCTM().inverse())
}

const grid = (rect: Rectangle, gutter: number, c: string) => {
  var layer = g_nodes.select('g.background_layer')
  var dx = (rect.width - (CELLS - 1) * gutter) / CELLS
  var dy = (rect.height - (CELLS - 1) * gutter) / CELLS

  for (var i = 0; i < CELLS; ++i) {
    for (var j = 0; j < CELLS; ++j) {
      layer.append('svg:rect')
        .attr('class', c + ' ' + c + '-' + i + '-' + j)
        .attr('x', rect.x + i * (dx + gutter))
        .attr('y', rect.y + j * (dy + gutter))
        .attr('width', dx)
        .attr('height', dy)
    }
  }
}

export function intersectsPerson(person: Point): Array<Node> {
  var rect = svg.node().createSVGRect() as Rectangle;
  rect.x = person.x; rect.y = person.y;
  rect.width = IMG_WIDTH * SCALE;rect.height = IMG_HEIGHT * SCALE;
  return svg.node().getIntersectionList(rect, svg.node());
}

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
}

/* Return an array of the data of nodes that intersect the screen rect */
export function visibleData(): Array<Node> {
  if (!visibleRect) {
    visibleRect = svg.node().createSVGRect()
    visibleRect.x = 30
    visibleRect.y = 30
  }
  visibleRect.width = window.innerWidth - 60
  visibleRect.height = window.innerHeight - 60

  const visibleNodes = svg.node().getIntersectionList(visibleRect, svg.node())
  return $(visibleNodes).closest('.node').map((i, node) =>
    d3.select(node).datum()
  ).get() as Array<Node>;
}

export const startpos = (): Point => (
  {
    x: Math.random() * (WIDTH / 2) + WIDTH / 4,
    y: Math.random() * (HEIGHT / 2) + HEIGHT / 4
  }
);

export function create(): Node {
  svg = d3.select("#main").append("svg");

  const defs = svg.append('defs')
  defs.append('clipPath').attr('id', 'circularPath').attr('clipPathUnits', 'objectBoundingBox').append('circle').attr('cx', '0.5').attr('cy', '0.5').attr('r', '0.4')
  const gradient = defs.append('radialGradient').attr('id', 'greenGradient').attr('cx', '50%').attr('cy', '50%').attr('fx', '50%').attr('fy', '50%').attr('r', '50%')
  gradient.append('stop').attr('stop-color', 'rgb(154, 254, 46)').attr('offset', '0%')
  gradient.append('stop').attr('stop-color', 'rgb(154, 230, 46)').attr('offset', '100%')

  g_nodes = svg.append('g').attr('class', 'nodes')
  g_nodes.append('g').attr('class', 'background_layer')
  g_nodes.append('g').attr('class', 'content_layer')
  g_nodes.append('g').attr('class', 'overlay_layer')

  grid({ x: 0, y: 0, width: WIDTH, height: HEIGHT }, MARGIN, 'grid')

  return svg
}

zooms.subscribe(function (event) {
  g_nodes.attr('transform', 'translate(' + event.translate[0] + ',' + event.translate[1] + ') ' + 'scale(' + event.scale + ')')
})
