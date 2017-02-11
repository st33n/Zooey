/*
 * D3+SVG based zoomable search interface
 */
const SCALE = 1
const GW = 140 * SCALE
const MARGIN = 1 * SCALE
const GH = GW / 1.618 * SCALE
const CELLS = 9

const WIDTH = (GW + MARGIN) * CELLS - MARGIN
const HEIGHT = (GH + MARGIN) * CELLS - MARGIN

const x = d3.scaleLinear().range([0, WIDTH])
const y = d3.scaleLinear().range([0, HEIGHT])

const IMG_WIDTH = 32 * SCALE
const IMG_HEIGHT = 40 * SCALE

// Intercom
const drags = new Rx.Subject()
const zooms = new Rx.Subject()

const svg = d3.select("svg")
const g_nodes = svg.select("g.nodes")

let visibleRect

svg.call(d3.zoom().on('zoom', () => {
  g_nodes.attr(
    'transform',
    'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') ' + 'scale(' + d3.event.transform.k + ')')
}))

function screenToClient(x, y) {
  const pt = svg.node().createSVGPoint()
  pt.x = x
  pt.y = y
  return pt.matrixTransform(svg.node().getScreenCTM().inverse())
}

function grid(rect, gutter, c) {
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

function intersects(o) {
  var rect = svg.node().createSVGRect();
  rect.x = o.x; rect.y = o.y;
  rect.width = IMG_WIDTH * SCALE;rect.height = IMG_HEIGHT * SCALE;
  return svg.node().getIntersectionList(rect, svg.node());
}

/* Return an array of the data of nodes that intersect the screen rect */
function visibleData() {
  if (!visibleRect) {
    visibleRect = svg.node().createSVGRect()
    visibleRect.x = 30
    visibleRect.y = 30
  }
  visibleRect.width = window.innerWidth - 60
  visibleRect.height = window.innerHeight - 60

  const visibleNodes = svg.node().getIntersectionList(visibleRect, svg.node())
  return $(visibleNodes).closest('.node').map(function (i, node) {
    return d3.select(node).datum()
  }).get()
}

function startpos() {
  return {
    x: Math.random() * (WIDTH / 2) + WIDTH / 4,
    y: Math.random() * (HEIGHT / 2) + HEIGHT / 4
  }
}

drags.subscribe(e => { console.log('drags', e) })
zooms.debounce(100).subscribe(e => { console.log('zooms', e) })

document.addEventListener("DOMContentLoaded", () => {
  grid({ x: 0, y: 0, width: WIDTH, height: HEIGHT }, MARGIN, 'grid')
})

