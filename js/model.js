var Model = (function(my, Intercom, Immutable) {
  "use strict";

  my.nodes = Immutable.fromJS([
    { x: 745, y: 500, w: 200, text: "Enter the badger", type: 'text' },
    { x: 700, y: 500, w: 800, h: 600,
      src: "file:./index.html", story: "#koan23", type: 'html' }
  ]);

  return my;
}(Model || {}, Intercom, Immutable));

