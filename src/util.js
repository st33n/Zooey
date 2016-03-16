/* @flow */
import d3 from 'd3'
import Rx from 'rx'
import $ from 'jquery'
import { zooms, state$ } from './intercom'

type Data = { type: string, x: number, y: number, text: string, name: string, attachments: Array<string> }
type DataFunc<T> = ((d:Data) => T) | T

declare class SVGPoint {
  x: number;
  y: number;

  matrixTransform(p: SVGPoint): SVGPoint;
  inverse(): SVGPoint;
}

declare class SVGRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

declare class SVGElement extends Element {
  createSVGPoint(): SVGPoint;
  createSVGRect(): SVGRect;
  getScreenCTM(): SVGPoint;
  getIntersectionList(rect: SVGRect, context: SVGElement): Array<SVGElement>;
}

export const textBox = function (gs: Object, text: DataFunc<string>, fontSize: DataFunc<string>, radius: DataFunc<number>): Object {
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
export const visibleNodes = function(context: SVGElement, selector: string): Array<Data> {
  const visibleRect = context.createSVGRect();
  visibleRect.x = 80;
  visibleRect.y = 60;
  visibleRect.width = window.innerWidth - 160;
  visibleRect.height = window.innerHeight - 120;

  const visibleNodes = context.getIntersectionList(visibleRect, context);
  return $(visibleNodes).closest(selector).map((i, node) => d3.select(node).datum()).get();
};

/*
zooms.subscribe(event => {
  let op = (24 - (event.scale - 6)) / 24
  if (op > 1) op = 1
  if (op < 0) op = 0
  elements().attr('opacity', op)
})
*/
