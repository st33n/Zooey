import Rx from 'rx'

export const textnodes = new Rx.Subject()

export const drags$ = new Rx.Subject()

export const zooms = new Rx.Subject()

// List of listeners that are synchronously called on layout ticks
export const tickers = []

export const state$ = new Rx.ReplaySubject(1)

state$.subscribe(e => { console.log('state', e) })

