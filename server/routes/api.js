var express = require('express');
var router = express.Router();
var passport = require('passport');
var UserController = require('../user/userController.js');
var helpers = require('./helpers.js');

var request = require('request');
var darkskyKey = process.env.darkskyKey || require("../config").darkskyKey;
var googlePlacesKey = process.env.googlePlacesKey || require("../config").googlePlacesKey;
var GooglePlaces = require('google-places');
var places = new GooglePlaces( googlePlacesKey );
var Q = require('q');

router.post('/user/register', UserController.register);

router.post('/user/login', UserController.login);

router.get('/user/logout', UserController.logout);

router.get('/user/pastSearches', UserController.pastSearches);

router.get('/user/status', UserController.status);

router.post('/placeData', helpers.placeData);

router.post('/weather/currently', helpers.weatherCurrently);

router.post('/weather/history', helpers.weatherHistory);

module.exports = router;