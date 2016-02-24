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

let nodes = []
const links = []

const link = (source, target, rank) => {
  if (source && target) {
    links.push({ source, target, rank })
  }
}

const people = {}
const addPerson = (person) => {
  if (!people[person.id]) {
    person.type = 'person'
    people[person.id] = person
  }
  return people[person.id]
}

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
      backgroundColor: '#ff6d5a'
    }
    nodes.push(statusNode)
    group.forEach(node => {
      link(statusNode, node, 1)
    })
  })

  ns.forEach(conversation => {
    link(conversation, addPerson(conversation.requester), 0)
    conversation.comments.forEach(comment => {
      link(conversation, addPerson(comment.author), 2)
    })
  })

  _.values(people).forEach(p => nodes.push(p))

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

  Rx.Observable.fromPromise($.getJSON('/inbox'))
    .map(result => result.data.account.conversations)
    .subscribe(conversations => {
      conversations.forEach(c => {
        c.x = 500
        c.y = 400
        c.type = 'text'
        c.text = c.subject.substring(0, 25)
        c.backgroundColor = '#bbb'
      })
      addNodes(conversations)
    })
})

