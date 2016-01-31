import Rx from 'rx';
import { zooms, models, visibleNodes } from './intercom';

/* Combine zooms and model changes to produce an event stream of visibleNodes */
Rx.Observable.combineLatest(
  zooms.debounce(300), models,
    (zoom, model) => model.filter(node => {
      console.log(zs);
      return true; // node.get("w") > 10 || node.get("fontSize");
    })
  ).subscribe(visibleNodes);

