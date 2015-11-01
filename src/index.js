
import $ from 'jquery';
import Immutable from 'immutable';
import { create as spaceCreate } from './searchspace';
import { textnodes } from './textnodes';
import { model } from './intercom';
import { create as zoomCreate } from './zoom';
import './foreign';

$(() => {
  let svg = spaceCreate();
  zoomCreate(svg);

  model.onNext(Immutable.fromJS([
    { x: 745, y: 500, w: 200, text: "Enter the badger", type: 'text' },
    { x: 700, y: 500, w: 800, h: 600,
      src: "file:./index.html", story: "#koan23", type: 'html' }
  ]));

});

