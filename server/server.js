#!/usr/bin/env node

var debug = require('debug')('passport-mongo');
var app = require('./app');
var port = process.env.PORT || 3000;

app.set('port', port);
console.log( 'Listening on port ', port );

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
