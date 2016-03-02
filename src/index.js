/* @flow */
import Rx from 'rx'
import $ from 'jquery'
import _ from 'underscore'
import { create as spaceCreate } from './searchspace'
import { enter as enterTexts, tick as textTick } from './textnodes'
import { enter as enterPeople, tick as peopleTick } from './person'
import { create as zoomCreate } from './zoom'
import './visibility'
import { force } from './layout'
import { enterLinks, linkTick } from './links'

const nodes = []
const links = []

const link = (source, target, rank) => {
  if (source && target) {
    links.push({ source, target, rank })
  }
}

const packages = {}
const addPackage = (name, pkg, level) => {
  level = level || 0
  if (!packages[name]) {
    pkg.type = 'text'
    pkg.text = name
    pkg.color = 'black'
    pkg.backgroundColor = '#ff6d5a'
    pkg.x = 500
    pkg.y = 200
    if (level === 0) {
      pkg.fixed = true
    }
    packages[name] = pkg

    if (pkg.dependencies) {
      Object.keys(pkg.dependencies).forEach(dep =>
        link(pkg, addPackage(dep, pkg.dependencies[dep], level + 1), level)
      )
    }
  }
  return packages[name]
}

const start = () => {
  console.log('start', nodes.length)
  _.values(packages).forEach(p => nodes.push(p))

  force.nodes(nodes)
  force.links(links)
  enterTexts(nodes)
  enterPeople(nodes)
  enterLinks(links)

  force.on('tick', t => { textTick(force); peopleTick(force); linkTick() })
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

  Rx.Observable.combineLatest(
    Rx.Observable.fromPromise($.getJSON('/data/all.json')),
    Rx.Observable.fromPromise($.getJSON('/data/outdated.json')),
    (all, outdated) => {
      all.forEach(result => addPackage(result.name, result))
      outdated.forEach(console.log)
      start()
    }
  )
})

