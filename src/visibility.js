import Rx from 'rx'
import { zooms, state$, visibleNodes } from './intercom'

/* Combine zooms and model changes to produce an event stream of visibleNodes */
Rx.Observable.combineLatest(
  zooms.debounce(300), state$.filter(s => s.has('armies')),
    (zoom, current) => current.get('armies')
  ).subscribe(visibleNodes)

