import d3 from 'd3'

export const enterLinks = (links) => {
  d3.select('svg g.links').selectAll('.link').data(links).enter().append('line')
    .attr('class', d => 'link rank' + d.rank)
    .style('stroke', 'black')
}

export const linkTick = () => {
  d3.select('svg g.links').selectAll('.link')
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
}

