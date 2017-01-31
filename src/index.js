/* @flow */

import Rx from 'rx'
import $ from 'jquery'
import { Record, Map, List, fromJS } from 'immutable'
import { create as spaceCreate } from './searchspace'
import './textnodes'
import { Army } from './army'
import { state$, action$ } from './intercom'
import { create as zoomCreate } from './zoom'
import './visibility'

const CreateAction = Record({
  id: 'create',
  data: new Map()
})

const unitCreationReducer = (state, action) => {
  if (action.id === 'create') {
    return state.update('units',
      new List(),
      list => list.push(action.get('data')))
  }
  return state
}

const SPEED = 5

const moved = (unit) => {
  const dest = unit.dest
  if (!dest) {
    return unit
  }
  const dx = dest[0] - unit.x
  const dy = dest[1] - unit.y
  console.log('move', dx, dy)

  if (Math.abs(dx) < 2 && Math.abs(dy) < 2) { // close enough
    return unit.delete('dest')
  }
  let vx = 0
  let vy = 0
  if (dx !== 0) {
    const a = Math.atan(dy / Math.abs(dx))
    vx = Math.cos(a) * SPEED * Math.sign(dx)
    vy = Math.sin(a) * SPEED
  } else {
    vx = 0
    vy = SPEED * Math.sign(dy)
  }

  return unit
    .update('x', x => x + vx)
    .update('y', y => y + vy)
}

const movementReducer = (state, action) => {
  if (action.get('id') === 'tick') {
    return state.update('units',
      new List(),
      list => list.map(unit => {
        if (unit.has('dest')) {
          return moved(unit)
        }
        return unit
      }))
  }
  return state
}

const combineReducer = (reducers) =>
  (initialState, action) =>
    reducers.reduce((state, r) => r(state, action), initialState)

// Make time go
Rx.Observable.interval(1000)
  .map(t => fromJS({ id: 'tick', tick: t }))
  .subscribe(action$)

/* Apply our reducers to the current state and incoming events, then post the result to state$ */
action$
  .scan(combineReducer([movementReducer, unitCreationReducer]), Map())
  .subscribe(state$)

Rx.Observable.interval(1000, 1000)
  .map(i => new CreateAction({
    data: new Army({
      x: Math.random() * 1000,
      y: Math.random() * 800,
      dest: [500, 400],
      i
    })
  }))
  .subscribe(action$)

$(() => {
  let svg = spaceCreate()
  zoomCreate(svg)
/*
  const models = Immutable.fromJS([
    { id: 'create', data: { x: 745, y: 500, w: 200, text: 'Do not think good...', type: 'text' } },
    { id: 'create', data: { x: 745, y: 700, w: 200, text: 'Do not think not good...', type: 'text' } },
    { id: 'create', data: { x: 400, y: 500, dest: [300, 200], type: 'army' } },
    { id: 'create', data: { x: 100, y: 300, dest: [800, 390], type: 'army' } }
  ])
  models.forEach(item => action$.onNext(item))
 */
/*
  // Push something onto nodeSource every second
  Rx.Observable.timer(1000, 1000).map(() => {
    const fs = Math.floor(Math.random() * 30) + 4
    console.log('FS', '' + fs + 'px')
    return { x: Math.random() * 1024,
      y: Math.random() * 800,
      fontSize: '' + fs + 'px',
      text: 'A random text', type: 'text' }
  }).subscribe(nodeSource)
*/
})

