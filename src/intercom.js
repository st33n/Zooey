import Rx from 'rx';

export const textnodes = new Rx.Subject();

// Visual items updated are posted here - SVG DOM elements
export const visual = new Rx.Subject();

export const drags = new Rx.Subject();

export const zooms = new Rx.Subject();

export const visibleNodes = new Rx.ReplaySubject(1);

// List of listeners that are synchronously called on layout ticks
export const tickers = [];

export const model = new Rx.ReplaySubject(1);

textnodes.subscribe(e => { console.log("textnodes", e) });
visual.subscribe(e => { console.log("visual", e) });
drags.subscribe(e => { console.log("drags", e) });
zooms.subscribe(e => { console.log("zooms", e) });
model.subscribe(e => { console.log("model", e) });
visibleNodes.subscribe(e => { console.log("visibleNodes", e) })

