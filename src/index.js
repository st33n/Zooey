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
import { link, enterLinks, tick as linkTick } from './links'
import type { Data } from './util'
import { setRandomPoint, WIDTH, HEIGHT } from './util'

const nodes: Array<Data> = []
const modules: Map<number, Data> = new Map()
const directory: Map<String, Array<Data>> = new Map()

const addParentNode = (data) => {
  data.type = 'text'
  data.text = 'parent'
  data.x = WIDTH / 2
  data.y = HEIGHT / 2
  data.fixed = true
  nodes.push(data)
  data.children.forEach((child) => {
    addNode(child)
    link(data, child, 2, "CHUNK")
  })
  data.modules.forEach((module) => {
    let m = addModule(module)
    if (m) {
      link(data, m, 1, "CHUNK")
    }
  })}

const addNode = (data) => {
  data.type = 'text'
  data.text = 'child'
  setRandomPoint(data)
  nodes.push(data)
  data.chunks.forEach((chunk) => {
    if (!chunk.names.join().match('node_modules')) {
      addChunk(chunk)
      link(data, chunk, 2, "CHUNK")
    }
  })
}

const addChunk = (data) => {
  data.type = 'text'
  data.text = 'chunk: ' + data.names.join(', ')
  setRandomPoint(data)
  nodes.push(data)
  data.modules.forEach((module) => {
    let m = addModule(module)
    if (m) {
      link(data, m, 1, "CHUNK")
    }
  })
}

const groups = ["src"]

const groupForModuleName = (name: string): number => {
  const g = 0
  if (name.match("^./src/")) {
    return groups.indexOf("src")
  }
  const module = name.match('^/~/(.+)/')
  if (module) {
    if (groups.indexOf(module[1]) === -1) {
      groups.push(module[1])
    }
    return groups.indexOf(module[1])
  }
  console.log('unknown module name pattern', name)
  return 1
}

const addModule = (data: Data): ?Data => {
  if (data.id) {
    const module = modules.get(data.id)
    if (!module) {
      data.type = 'module'
      setRandomPoint(data)
      data.group = groupForModuleName(data.name)
      nodes.push(data)
      modules.set(data.id, data)
      return data
    }
    return module
  }
}

const linkModules = () => {
  for (let module of modules.entries()) {
    const m = module[1].reasons
    if (m !== null) {
      m.forEach((reason) => {
        const target: ?Data = modules.get(reason.moduleId)
        if (target) {
          link(module[1], target, 0, "IMPORT")
        }
      })
    }
  }
}

const start = () => {
  force.nodes(nodes)
  const links = enterLinks(force)
  state$.onNext({ nodes, links })

  force.on('tick', t => { textTick(force); linkTick(); moduleTick(force) })
  force.start()
}

/*
// Make time go
Rx.Observable.interval(1000)
  .map(t => Immutable.fromJS({ id: 'tick', tick: t }))
  .subscribe(t => { force.tick() })
*/
$(() => {
  let svg = spaceCreate()
  zoomCreate(svg)

  $.getJSON('/data/stats-z.json').then((data) => {
    addParentNode(data)
    linkModules()
    start()
  })
})

