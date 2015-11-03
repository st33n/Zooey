
import $ from 'jquery';
import Immutable from 'immutable';
import Rx from 'rx';
import { create as spaceCreate } from './searchspace';
import { textnodes } from './textnodes';
import { model } from './intercom';
import { create as zoomCreate } from './zoom';
import './foreign';

$(() => {
  let svg = spaceCreate();
  zoomCreate(svg);

  let m = Immutable.fromJS([
    { x: 745, y: 500, w: 200, text: "Enter the badger", type: 'text' },
    { x: 700, y: 500, w: 800, h: 600,
      src: "file:./index.html", story: "#koan23", type: 'html' }
  ]);
  model.onNext(m);

  let nodeSource = Rx.Observable.timer(1000, 1000).map(() => {
    return { x: Math.random() * 1024,
      y: Math.random() * 800,
      w: Math.random() * 350,
      text: "A random text", type: 'text' };
  });

  nodeSource.withLatestFrom(model,
    (ns, m) => m.push(Immutable.fromJS(ns))).subscribe(model);
});

