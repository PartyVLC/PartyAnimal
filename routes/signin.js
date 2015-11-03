var express = require('express');
var router = express.Router();
var session = require('express-session')
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username:username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log("Incorrect Username");
        return done(null, false, {message: "Incorrect Username/Password."});
      }
      if (!user.validPassworkd(password)) {
        console.log("Incorrect Password");
        return done(null, false, {message: "Incorrect Username/Password."});
      }
      return done(null, user);
    });
  }
));

/* GET Login page. */
// router.post('/login', passport.authenticate('local', { successRedirect: '/',
//                                                        failureRedirect: '/login'}));

// router.post('/login', passport.authenticate('local'),
//   function(req, res) {
//     res.redirect('/users/' + req.user.username);
//  });