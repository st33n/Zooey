var express = require('express');
var request = require('request');

var port = process.env.PORT || 3000;

var app = express();

app.use(express.static('public'));
/*
app.get("/wiki/:titles", function(req, res) {
  request
    .get({
      url: "https://en.wikipedia.org/w/api.php",
      qs: {
        action: "query",
        titles: req.params.titles || "Main Page",
        prop: "revisions",
        rvprop: "content",
        format: "json"
      },
      json: true
    })
    .pipe(res);
});
*/
app.get("/wikipedia/:title", function(req, res) {
  request.get({
    url: "https://rest.wikimedia.org/en.wikipedia.org/v1/page/html/"
      + req.params.title
  }).pipe(res);
});

app.listen(port);

console.log('Server is running on ' + port);

