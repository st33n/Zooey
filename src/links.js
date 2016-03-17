/* @flow */
import d3 from 'd3'
import { Data, Link } from 'util'
import type { LinkType } from 'util'

const links: Array<Link> = []

export const link = (source: Data, target: Data, rank: number, type: LinkType) => {
  links.push({ source, target, rank, type })
}

export const enterLinks = (force: any): Array<Link> => {
  force.links(links)
  d3.select('svg g.links').selectAll('.link').data(links).enter().append('line')
    .attr('class', d => 'link rank' + d.rank)
    .style('stroke', '#aaa')
  return links
}

export const tick = () => {
  d3.select('svg g.links').selectAll('.link')
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
}

