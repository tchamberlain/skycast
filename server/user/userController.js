var User = require('../user/userModel.js');
var Q = require('q');
var findUser = Q.nbind(User.findOne, User);
var passport = require('passport');


module.exports = {

  register: function(req, res) {
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
  },

  login: function(req, res, next) {
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
  },

  logout: function(req, res) {
    req.logout();
    res.status(200).json({
      status: 'Bye!'
    });
  },

  pastSearches: function(req, res) {
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
  },
  
  status: function(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(200).json({
        status: false
      });
    }
    res.status(200).json({
      status: true
    });
  },

  addSearch: function ( id, place ){
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

}