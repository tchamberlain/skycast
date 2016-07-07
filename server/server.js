#!/usr/bin/env node

var debug = require('debug')('passport-mongo');
var app = require('./app');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV || 'development';

var mongoURI = process.env.MONGODB_URI || require('./config').localMongoURI;

// mongoose
mongoose.connect( mongoURI );


app.set('port', port);
console.log( 'Listening on port ', port );

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
