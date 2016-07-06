var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');
var request = require('request');
var darkskyKey = require("../config").darkskyKey;
var GooglePlaces = require('google-places');
var places = new GooglePlaces(require("../config").googlePlacesKey);
var Q = require('q');
var findUser = Q.nbind(User.findOne, User);

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
        status: 'Registration successful!',

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

router.get('/user/pastSearches', function(req, res) {
    User.findOne({_id: req.user._id })
    .then(function (user) {
      if (user) {
        res.json({
          username: user.username,
          pastSearches: user.pastSearches
        });
      } else {
        console.error('Error finding users');
      }
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

    // record this search in the user's search history
    addToSearchHistory(req.user._id, response.result.name);

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

var addToSearchHistory = function( id, placeName ){
  User.findOne({_id: id })
    .then(function(user) {
      user.pastSearches.push(placeName);
      user.save(function(err) {
        if (err) {
          console.error(err);
        } 
      });
    });
}

module.exports = router;