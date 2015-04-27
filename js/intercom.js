var Intercom = (function (my, Bacon, _) {
  "use strict";

  // Items on this bus are lists of links
  my.textnodes = new Bacon.Bus().log("textnodes->");

  // Visual items updated are posted here - SVG DOM elements
  my.visual = new Bacon.Bus().log("visual->");

  my.drags = new Bacon.Bus().log("drag->");

  my.zooms = new Bacon.Bus();

  my.contentZooms = new Bacon.Bus();

  // List of listeners that are synchronously called on layout ticks
  my.tickers = [];

  return my;
}(Intercom || {}, Bacon, _));


