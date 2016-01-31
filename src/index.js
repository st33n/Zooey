
import $ from 'jquery';
import Rx from 'rx';
import Immutable from 'immutable';
import { create as spaceCreate } from './searchspace';
import './textnodes';
import { models, nodeSource } from './intercom';
import { create as zoomCreate } from './zoom';
import './foreign';
import './visibility';

$(() => {
  let svg = spaceCreate();
  zoomCreate(svg);

  let m = Immutable.fromJS([
    { x: 745, y: 500, w: 200, text: "Do not think good...", type: 'text' },
    { x: 700, y: 500, w: 800, h: 600,
      story: "#koan23", type: 'html' },
    { x: 100, y: 300, w: 800, h: 2000,
      wikipedia: "Reactive programming", type: 'html' },
    { x: 200, y: 300, w: 800, h: 2000,
      wikipedia: "Clojure", type: 'html' },
    { x: 300, y: 300, w: 800, h: 2000,
      wikipedia: "Spreadsheet", type: 'html' }
  ]);
  models.onNext(m);

  // Push something onto nodeSource every second
  /*
  Rx.Observable.timer(1000, 1000).map(() => {
    const fs = Math.floor(Math.random() * 30) + 4;
    console.log("FS", "" + fs + "px");
    return { x: Math.random() * 1024,
      y: Math.random() * 800,
      fontSize: "" + fs + "px",
      text: "A random text", type: 'text' };
  }).subscribe(nodeSource);
  */

  // Whatever arrives in nodeSource is added to the model, here
  nodeSource.subscribe(node => {
    m = m.push(Immutable.fromJS(node));
    models.onNext(m);
  });
});

