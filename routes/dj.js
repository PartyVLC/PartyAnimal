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

var updateUser = function(users, user, callback) {
  users.findOne({ 'username' :  user.username }),
    function(err, userupdate) {
      return callback(userupdate)
    }
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

  router.get('/newtest',function(req, res) {
      console.log(req.user)
      res.render('dj', { dj : req.user })
  })

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
    res.render('dj_home', { user: req.user });
  });

  /* Handle Logout */
  router.get('/signout', function(req, res) {
      req.logout();
      res.redirect('/dj');
  });

  /* Handle New Set POST */
  router.post('/set/new', isAuthenticated, function(req, res) {
      users.update(
        { _id: req.user._id },
        { $push: { playlists: {title: req.body.title, songs: []} } }
      );
      res.redirect('/dj/home');
  });

    // What the fuck is this?
  router.get('/set/delete/:id', isAuthenticated, function(req, res) {
      var path = '/dj/set/'+req.params.id;
      var options = {
          host: 'localhost',
          port: '5000',
          path: path,
          method: 'delete'
      };
      callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          console.log(str);
          //res.redirect('/dj/home');
        });
      }
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