var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');
var request = require('request');
var darkskyKey = require("../config").darkskyKey;
var GooglePlaces = require('google-places');

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

router.get('/placeInfo', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

router.get('/weatherData', function(req, res) {
    var url = 'https://api.forecast.io/forecast/'+darkskyKey+'/42.7243,-73.6927';
  request(url, function (error, response, body) {
    // if (!error && response.statusCode == 200) {
    //   var test = JSON.parse(body);   
    //   console.log(test); 
    // } else {
    //   console.error(error);
    // }
     var forecastData = JSON.parse(body);
     //daily
    // console.log('response-- url???',forecastData.currently);
    res.json(forecastData.daily);
    console.log('response-- url???',forecastData.daily);
  });
});


module.exports = router;