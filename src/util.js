/* @flow */
import d3 from 'd3'
import Rx from 'rx'
import $ from 'jquery'
import { zooms, state$ } from './intercom'

const GW = 250
const MARGIN = 1
const GH = GW / 1.618
const CELLS = 9

export const WIDTH = (GW + MARGIN) * CELLS - MARGIN
export const HEIGHT = (GH + MARGIN) * CELLS - MARGIN
export const color = d3.scale.category20()

type ModuleRef = { moduleName: string }

export interface Data {
  type: string;
  x: number;
  y: number;
  text: string;
  fixed: boolean;
  group: number;

  id: number;
  name: string;
  attachments: Array<string>;
  reasons: Array<ModuleRef>;
}

type DataFunc<T> = ((d:Data) => T) | T;
export type LinkType = "IMPORT" | "CHUNK";

export interface Link {
  source: Data;
  target: Data;
  rank: number;
  type: LinkType;
}

interface SVGPoint {
  x: number;
  y: number;

  matrixTransform(p: SVGPoint): SVGPoint;
  inverse(): SVGPoint;
}

interface SVGRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SVGElement extends Element {
  createSVGPoint(): SVGPoint;
  createSVGRect(): SVGRect;
  getScreenCTM(): SVGPoint;
  getIntersectionList(rect: SVGRect, context: SVGElement): Array<SVGElement>;
}

export const textBox = function (gs: Object, text: DataFunc<string>, fontSize: DataFunc<string>, radius: DataFunc<number>): Object {
  const t = gs.append('svg:text')
      .style('font-size', fontSize)
      .text(text)
  t.each(function (data, i) {
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
        .attr('fill', d => d.group ? color(d.group) : undefined)
  })
  return t
}

export const tickHandlerFor = (selector: any): any => {
  return (force: any) =>
    selector().attr('transform', d => `translate(${d.x},${d.y})`).call(force.drag)
}

// Resize based on scale / zoom level
export const dynamicResize = (selector: any, min: number, max: number): void => {
  zooms.debounce(300).pluck('scale').map(
    scale => ({
      scale,
      contentScale: Math.max(Math.min(1 - scale / 8, max), min)
    })
  ).subscribe(event => {
    selector().selectAll('*')
      .transition()
      .duration(400)
      .ease('cubic-out')
      .attr('transform', 'scale(' + event.contentScale + ')')
  })
}

export const screenToClient = (context: SVGElement, x: number, y: number): SVGPoint => {
  let pt = context.createSVGPoint()
  pt.x = x
  pt.y = y
  return pt.matrixTransform(context.getScreenCTM().inverse())
}

/* Return an array of the data of nodes that intersect the screen rect */
export const visibleNodes = (context: SVGElement, selector: string): Array<Data> => {
  const visibleRect = context.createSVGRect();
  visibleRect.x = 80;
  visibleRect.y = 60;
  visibleRect.width = window.innerWidth - 160;
  visibleRect.height = window.innerHeight - 120;

  const visibleNodes = context.getIntersectionList(visibleRect, context);
  return $(visibleNodes).closest(selector).map((i, node) => d3.select(node).datum()).get();
}

export const setRandomPoint = (d: Data): void => {
  d.x = Math.random() * (WIDTH / 2) + WIDTH / 4
  d.y = Math.random() * (HEIGHT / 2) + HEIGHT / 4
}

export const grid = (rect: SVGRect, gutter: number, c: string): void => {
  const g_nodes = d3.select('g.nodes')
  const layer = g_nodes.select('g.background_layer')
  const dx = (rect.width - (CELLS - 1) * gutter) / CELLS
  const dy = (rect.height - (CELLS - 1) * gutter) / CELLS

  for (let i = 0; i < CELLS; ++i) {
    for (let j = 0; j < CELLS; ++j) {
      layer.append('svg:rect')
        .attr('class', c + ' ' + c + '-' + i + '-' + j)
        .attr('x', rect.x + i * (dx + gutter))
        .attr('y', rect.y + j * (dy + gutter))
        .attr('width', dx)
        .attr('height', dy)
    }
  }
}


