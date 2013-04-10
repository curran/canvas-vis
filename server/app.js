var express = require('express');
var app = express();
var port = 8080;

app.use(express.static('../'));

app.listen(port);
console.log('Listening on port '+port);

// TODO use markdown transformer
// http://stackoverflow.com/questions/7549627/passing-raw-markdown-text-to-jade
