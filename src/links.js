/* @flow */
import d3 from 'd3'
import { Data, Link, color } from './util'
import type { LinkType } from './util'

const links: Array<Link> = []

export const link = (source: Data, target: Data, rank: number, type: LinkType) => {
  links.push({ source, target, rank, type })
}

export const enterLinks = (force: any): Array<Link> => {
  force.links(links)
  const line = d3.select('svg g.links').selectAll('.link').data(links).enter()
    .append('line')
      .attr('class', d => 'link rank' + d.rank)
      .attr('marker-end', 'url(#arrow)')
      .style('stroke', d => color(d.source.group))
      .attr('stroke-dasharray', d => d.source.group !== d.target.group ? "30,5" : undefined)
      .attr('d', 'M5 60 1215 0')
  return links
}

export const tick = () => {
  d3.select('svg g.links').selectAll('.link')
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
}

