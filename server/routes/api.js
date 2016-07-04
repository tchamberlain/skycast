var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');
var request = require('request');
var darkskyKey = require("../config").darkskyKey;
var GooglePlaces = require('google-places');
var places = new GooglePlaces(require("../config").googlePlacesKey);


router.post('/user/register', function(req, res) {
  User.register(new User({ username: req.body.username }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/user/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/user/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/user/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

router.post('/placeData', function(req, res) {
  places.autocomplete({ input: req.body.place }, function(err, response) {
    
    if( err ){
     return res.status(500).json({
       err: err
     });
    } 
    return res.json( response.predictions );

    // for(var i=0; i < response.predictions.length; i++){
    //   console.log('value3',response.predictions[i].terms[0].value);
    // }    
    
    // var success = function(err, response) {
    //   var lat = response.result.geometry.location.lat;
    //   var lng = response.result.geometry.location.lng;
    //   console.log("lat,lng ",lat,lng);
    // };
    function success(err, response) {
      console.log('NAME:',response.result.name);
    };
    for(var index in response.predictions) {
      places.details({reference: response.predictions[index].reference}, success);
    }
  });
});


router.post('/weather/currently', function(req, res) {
  
  places.details({reference: req.body.place.reference}, callForecastApi);
  
  function callForecastApi(err, response){
    if(err){
      return res.status(500).json({
        err: err
      }); 
    }
    var lat = response.result.geometry.location.lat;
    var lng = response.result.geometry.location.lng;
    var url = 'https://api.forecast.io/forecast/' + darkskyKey + '/' + lat + ',' + lng;
    request(url, function (error, response, body) {
      if(err){
        return res.status(500).json({
          err: err
        }); 
      }
      var forecastData = JSON.parse(body);
      res.json(forecastData);
    });
  }
});



module.exports = router;