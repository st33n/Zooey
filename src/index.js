/* @flow */

import $ from 'jquery'
import { create as spaceCreate } from './searchspace'
import { create as zoomCreate } from './zoom'

$(() => {
  let svg = spaceCreate()
  zoomCreate(svg)
})

