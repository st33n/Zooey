/* @flow */
import Rx from 'rx'
import $ from 'jquery'
import _ from 'underscore'
import { create as spaceCreate } from './searchspace'
import { enterTextNodes, nodeTick } from './textnodes'
import './army'
import { create as zoomCreate } from './zoom'
import './visibility'
import { force } from './layout'
import { enterLinks, linkTick } from './links'

let nodes = []
const links = []

const addNodes = (ns) => {
  nodes = nodes.concat(ns)

  const byStatus = _.groupBy(nodes, 'status')
  _.values(byStatus).forEach(group => {
    const statusNode = {
      x: 100,
      y: 200,
      type: 'text',
      text: group[0].status,
      color: 'white',
      backgroundColor: 'blue'
    }
    nodes.push(statusNode)
    group.forEach(node => {
      links.push({ source: statusNode, target: node, rank: 1 })
    })
  })

  force.nodes(nodes)
  force.links(links)
  enterTextNodes(nodes)
  enterLinks(links)

  force.on('tick', t => { nodeTick(force); linkTick() })
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

  Rx.Observable.fromPromise($.getJSON('/inbox'))
    .flatMap(result => result.data.account.conversations)
    .map(c => ({
      x: 500, y: 400,
      type: 'text',
      id: c.id,
      text: c.subject.substring(0, 20),
      status: c.status,
      fontSize: '8pt'
    }))
    .toArray()
    .subscribe(ns => addNodes(ns))
})

