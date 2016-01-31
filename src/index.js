
import Rx from 'rx'
import $ from 'jquery'
import Immutable from 'immutable'
import { create as spaceCreate } from './searchspace'
import './textnodes'
import './army'
import { state$, action$ } from './intercom'
import { create as zoomCreate } from './zoom'
import './visibility'

const unitCreationReducer = (state, action) => {
  if (action.get('id') === 'create' && action.get('data').get('type') === 'army') {
    state = state.update('armies',
      new Immutable.List(),
      list => list.push(action.get('data')))
    return state
  }
  return state
}

/* Apply our reducers to the current state and incoming events, then post the result to state$ */
action$
  .scan((state, action) => unitCreationReducer(state, action), Immutable.Map())
  .subscribe(state$)

$(() => {
  let svg = spaceCreate()
  zoomCreate(svg)

  const models = Immutable.fromJS([
    { id: 'create', data: { x: 745, y: 500, w: 200, text: 'Do not think good...', type: 'text' } },
    { id: 'create', data: { x: 745, y: 700, w: 200, text: 'Do not think not good...', type: 'text' } },
    { id: 'create', data: { x: 400, y: 500, type: 'army' } },
    { id: 'create', data: { x: 100, y: 300, type: 'army' } }
  ])
  models.forEach(item => action$.onNext(item))
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

