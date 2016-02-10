import Rx from 'rx'

export const textnodes = new Rx.Subject()

// Visual items updated are posted here - SVG DOM elements
export const visual = new Rx.Subject()

export const drags$ = new Rx.Subject()

export const zooms = new Rx.Subject()

export const visibleNodes = new Rx.ReplaySubject(1)

// List of listeners that are synchronously called on layout ticks
export const tickers = []

export const state$ = new Rx.ReplaySubject(1)
export const action$ = new Rx.Subject()

action$.subscribe(e => { console.log('actions', e) })
textnodes.subscribe(e => { console.log('textnodes', e) })
visual.subscribe(e => { console.log('visual', e) })
drags$.subscribe(e => { console.log('drags', e) })
zooms.debounce(100).subscribe(e => { console.log('zooms', e) })
state$.subscribe(e => { console.log('state', e) })
visibleNodes.subscribe(e => { console.log('visibleNodes', e) })

