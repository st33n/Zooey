/* @flow */
import Rx from 'rx'
import $ from 'jquery'
import _ from 'underscore'
import { create as spaceCreate } from './searchspace'
import { tick as textTick } from './textnodes'
import { create as zoomCreate } from './zoom'
import { state$ } from './intercom'
import { tick as moduleTick } from './module'
import { force } from './layout'
import { enterLinks, linkTick } from './links'

const nodes = []
const links = []

const link = (source, target, rank) => {
  if (source && target) {
    links.push({ source, target, rank })
  }
}

const modules = new Map()

const addParentNode = (data) => {
  data.type = 'text'
  data.text = 'parent'
  data.x = 200
  data.y = 100
  nodes.push(data)
  data.children.forEach((child) => {
    addNode(child)
    link(data, child, 1)
  })
}

const addNode = (data) => {
  data.type = 'text'
  data.text = 'child'
  data.x = 100
  data.y = 400
  nodes.push(data)
  data.chunks.forEach((chunk) => {
    addChunk(chunk)
    link(data, chunk, 2)
  })
}

const addChunk = (data) => {
  data.type = 'text'
  data.text = 'chunk: ' + data.names.join(', ')
  data.x = 500
  data.y = 200
  nodes.push(data)
  data.modules.forEach((module) => {
    link(data, addModule(module), 3)
  })
}

const addModule = (data) => {
  if (!modules.has(data.id)) {
    if (data.id < 100) {
      data.type = 'module'
    }
    else {
      data.type = 'text'
      data.text = 'module ' + data.id + ': ' + data.name
    }
    data.x = -200
    data.y = -200
    nodes.push(data)
    modules.set(data.id, data)
  }
  return modules.get(data.id)
}

const start = () => {
  console.log('start', nodes.length, links.length)

  force.nodes(nodes)
  force.links(links)
  enterLinks(links)
  state$.onNext({ nodes, links })

  force.on('tick', t => { textTick(force); linkTick(); moduleTick() })
  force.start()
}

/*
// Make time go
Rx.Observable.interval(1000)
  .map(t => Immutable.fromJS({ id: 'tick', tick: t }))
  .subscribe(t => { force.tick() })
*/
$(() => {
  console.log('launch')
  let svg = spaceCreate()
  zoomCreate(svg)

  $.getJSON('/data/stats.json').then((data) => {
    addParentNode(data)
    start()
  })
})

