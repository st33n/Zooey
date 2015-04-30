var Intercom = (function (my, Bacon, _) {
  "use strict";

  // Items on this bus are lists of links
  my.textnodes = new Bacon.Bus().log("textnodes->");

  // Visual items updated are posted here - SVG DOM elements
  my.visual = new Bacon.Bus().log("visual->");

  my.drags = new Bacon.Bus().log("drag->");

  my.zooms = new Bacon.Bus(); // .log("zoom->");

  my.contentZooms = new Bacon.Bus().log("c-zoom->");

  // List of listeners that are synchronously called on layout ticks
  my.tickers = [];

  return my;
}(Intercom || {}, Bacon, _));


