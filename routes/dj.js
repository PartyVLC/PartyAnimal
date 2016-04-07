var express = require('express');
var router = express.Router();
var http = require('http');

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect them to the login page
    res.redirect('/dj');
}

// var delSet = function()

module.exports = function(passport, db, Playlist, Song){
  var users = db.collection("djs")
  var playlists = db.collection("playlists")

  /* GET login page. */
  router.get('/', function(req, res) {
      // Display the Login page with any flash message, if any
      res.render('index', { message: req.flash('message') });
  });

  /* Handle Login POST */
  router.post('/signin', passport.authenticate('login', {
      successRedirect: '/dj/home',
      failureRedirect: '/dj',
      failureFlash : true  
  }));

  /* GET Registration Page */
  router.get('/signup', function(req, res) {
      res.render('dj_register',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
      successRedirect: '/dj/home',
      failureRedirect: '/dj/signup',
      failureFlash : true  
  }));

  /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res) {
    res.render('dj_home', { user: req.user })
  });

  /* Handle Logout */
  router.get('/signout', function(req, res) {
      req.logout()
      res.redirect('/dj')
  });

  /* Handle New Set POST */
  router.post('/set/new', isAuthenticated, function(req, res) {
      users.update(
        { _id: req.user._id },
        { $addToSet: { playlists: { title: req.body.title, songs: [] } } },
        function(err,result) {
          if (err) {
            console.log(err)
          }
        }
      )
      res.redirect('/dj/home')
  });

  router.post('/set/delete', isAuthenticated, function(req, res) {
    console.log(req.body.playlist)
    users.update(
      {
        _id: req.user._id
      },
      { 
        $pull : {
          playlists : { title : req.body.playlist } 
        }
      },
      function(err) {
        if (err) {
          console.log(err)
        }
      }
    )
    res.redirect('/dj/home')
  })

  router.get('/player/:id',function(req,res,next){
    res.render('player', { title: 'Playing'});
  });

  router.get('/playlist/:id',function(req,res,next){
    res.render('djplaylist', { title: 'Playlist'});
  });

  return router;
}