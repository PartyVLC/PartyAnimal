var express = require('express');
var router = express.Router();
var http = require('http');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  //console.log("isAuth")
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/')
  }
  // if the user is not authenticated then redirect them to the login page
}

module.exports = function(passport, db){
  var users = db.collection("djs")

  /* GET login page. */
  router.get('/', isAuthenticated, function(req, res, next) {
      // Display the Login page with a flash message, if any
      res.redirect('/dj/play/'+req.user.username)
  });

  router.get('/play/:username', isAuthenticated, function(req, res) {
    if (req.user.username != req.params.username) {
        res.redirect('/')
        // getUser(users, req.params.username, function (user) {
        //   console.log("route: " + user.username)
        //   res.render('dj/home', { user: user, playlist: user.playlist });
        // });
        // var user = getUser(users,req.params.username)
        // console.log("route: " + user)
        // res.render('dj/home', { dj : user })
      } else {
        res.render('dj/index', { dj : req.user })
      }
  })

  /* Handle Login POST */
  router.post('/signin', 
    passport.authenticate('login'), 
    function(req,res) {
      //console.log("signin " + req.user.username)
      res.redirect('/dj/play/'+req.user.username)
  });

  /* GET Registration Page */
  router.get('/signup', function(req, res) {
      res.render('dj/register',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
      successRedirect: '/dj/home',
      failureRedirect: '/dj/signup',
      failureFlash : true  
  }));

  /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res) {
    res.redirect('/dj/play/'+req.user.username)
    // res.render('dj/newSet',{user : req.user})
  });

  /* Handle Logout */
  router.get('/signout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  /* Handle New Set POST */
  router.post('/set/new', isAuthenticated, function(req, res) {
    users.update(
      { _id: req.user._id },
      { $push: { playlists: { title: req.body.title, songs: [] } } }
    );
    // res.redirect('/dj/home');
    res.end()
  });

  router.post('/set/current', isAuthenticated, function(req, res) {
    users.findOne(
      {
        _id : req.user._id,
      },
      {
        playlists : { $elemMatch : { title :  req.body.playlist } }
      },
      function(err, user) {
        if (err) {
          res.redirect('/')
        }
        else {
          users.update(
            { _id : user._id },
            { $set :
              { currentPlaylist :user.playlists[0]  }
            }
          )
          // res.redirect('/dj/home')
          res.end()
        }
      }
    )
    // res.end()
  })

  router.post('/set/delete', isAuthenticated, function(req, res) {
    if (req.user.currentPlaylist.title == req.body.playlist) {
      users.update(
        { _id : req.user.id },
        { $set : { currentPlaylist : {} } },
        function(err,res) {
          console.log(err)
          console.log(res)
        }
      );
    }
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
    // res.redirect('/dj/home')
    res.end()
  })

  router.get('/player/:id',function(req,res,next){
    res.render('player', { title: 'Playing'});
  });

  router.get('/playlist/:id',function(req,res,next){
    res.render('djplaylist', { title: 'Playlist'});
  });

  router.get('/user_data', function(req, res) {
    if (req.user === undefined) {
      // The user is not logged in
      res.json({});
    } else {
      res.json(req.user);
    }
  });

  router.post('/set/reset', isAuthenticated, function(req, res) {
    users.update(
    {
      
    })
  })

  router.get('/*', function(req, res) {
    console.log("not valid")
    res.redirect('/')
  })

  return router;
}