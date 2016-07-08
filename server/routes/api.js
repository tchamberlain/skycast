var express = require('express');
var router = express.Router();
var passport = require('passport');
var UserController = require('../user/userController.js');
var User = require('../user/userModel.js');
var request = require('request');
var darkskyKey = process.env.darkskyKey || require("../config").darkskyKey;
var googlePlacesKey = process.env.googlePlacesKey || require("../config").googlePlacesKey;
var GooglePlaces = require('google-places');
var places = new GooglePlaces( googlePlacesKey );
var Q = require('q');
var findUser = Q.nbind(User.findOne, User);

router.post('/user/register', UserController.register);

router.post('/user/login', UserController.login);

router.get('/user/logout', UserController.logout);

router.get('/user/pastSearches', UserController.pastSearches);

router.get('/user/status', UserController.status);

router.post('/placeData', function(req, res) {
  places.autocomplete({ input: req.body.place }, function(err, response) {
    if( err ){
     return res.status(500).json({
       err: err
     });
    } 
    // returning only names and references of places
    placeData = [];
    for( var i = 0; i < response.predictions.length; i++ ){
      placeData.push({ 
        name: response.predictions[i].terms[0].value,
        reference:  response.predictions[i].reference
      });
    }
    return res.json( placeData );
  });
});

router.post('/weather/currently', function(req, res) {
  // record this search in the user's search history
  addToSearchHistory(req.user._id, req.body.place);
  getLatAndLng(req.body.place)
  .then(function(result){
    return callForecastApi(result.lat, result.lng);
   })
   .then(function(result){
    var forecastData = JSON.parse(result);
    res.json(forecastData);
  });
});

router.post('/weather/history', function(req, res) {
  var promises = [];

  // get lat and lng from google places, then use to call the  forecastApi
  getLatAndLng(req.body.place)
  .then(function(result){
    var dates = generateDateArr();
    dates.forEach(function(date){
      var promise = callForecastApi(result.lat, result.lng, date).then(function(data){
        return Q( JSON.parse(data).daily.data[0] );
      });
      promises.push(promise);
    });

    Q.all(promises).then(function(data){
      res.json(data);
    });
   });
});


// ------- HELPERS -----------

// need to pass it an lat and lng, and an optional param date
var callForecastApi = function( lat, lng, date ){
  var dateParam = '';
  if( date !== undefined ){
    dateParam = ',' + date;
  }
  var url = 'https://api.forecast.io/forecast/' + darkskyKey + '/' + lat + ',' + lng + dateParam;
  var d = Q.defer();
  request(url, function (err, response, body) {
    if(err !== null) return d.reject(err); 
    d.resolve(body);
  });
  return d.promise;  
}

// need to pass it a place with a property reference
var getLatAndLng = function( place ){
  var d = Q.defer();
  places.details({reference: place.reference},function(err,data){
        if(err !== null) return d.reject(err); 
            var latLng = {};
            d.resolve({lat: data.result.geometry.location.lat, lng: data.result.geometry.location.lng  });
   });
  return d.promise;  
}

var addToSearchHistory = function( id, place ){
  User.findOne({_id: id })
    .then(function(user) {
      // Using concat so that search history appears with most recent first
      var newPlace = [place]
      user.pastSearches = newPlace.concat( user.pastSearches );
      user.save(function(err) {
        if (err) {
          console.error(err);
        } 
      });
    });
}

var addDays = function(days, origDate){
  var dat = new Date(origDate.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

var addYears = function(years){
  var dat = new Date();
  dat.setFullYear(dat.getUTCFullYear()+years);
  return dat;
}

// geneate an array of dates around the current day
// but a  year in the past
var generateDateArr = function(){
  var dates = [];
  var aYearAgo = addYears(-1);
  for(var i = 0; i < 30; i ++ ){
    var newDate = addDays( i, aYearAgo );
    // put it in iso format, as that is what the forecast api takes
    dates.push( newDate.toISOString().split('.')[0] );
  }
  return dates;
}

module.exports = router;