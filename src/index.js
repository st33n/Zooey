/* @flow */
import Rx from 'rx'
import $ from 'jquery'
import d3 from 'd3'
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
const modules: Map<string, Data> = new Map()

const addParentNode = (data) => {
  if (data.children) {
    data.children.forEach(addChild)
  }
  if (data.modules) {
    data.modules.forEach(addModule)
  }
}

const addChild = (data) => {
  data.chunks.forEach(addChunk)
}

const addChunk = (data) => {
  data.modules.forEach(addModule)
}

const groups = []

const groupForModuleName = (name: string): number => {
  const g = 0
  const module = name.match('[.]/(~|src)/([^/]+)')
  if (module) {
    if (groups.indexOf(module[2]) === -1) {
      groups.push(module[2])
    }
    return groups.indexOf(module[2])
  }
  console.log('unknown module name pattern', name)
  return 1
}

const addModule = (data: Data): ?Data => {
  if (!data.name.match("^multi")) {
  //if (data.name.match("^./src")) {
    const module = modules.get(data.name)
    if (!module) {
      data.type = 'module'
      setRandomPoint(data)
      data.group = groupForModuleName(data.name)
      nodes.push(data)
      modules.set(data.name, data)
      return data
    }
    return module
  }
}

const linkModules = () => {
  for (let module of modules.entries()) {
    const m = module[1].reasons
    if (m) {
      m.forEach((reason) => {
        const target: ?Data = modules.get(reason.moduleName)
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

$(() => {
  let svg = spaceCreate()
  zoomCreate(svg)

  $.getJSON('/data/stats.json').then((data) => {
    addParentNode(data)

    const tree = d3.layout.tree()
    tree.size([WIDTH, HEIGHT])
    tree.nodes(data)
    linkModules()
    start()
  })
})

