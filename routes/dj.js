var express = require('express');
var router = express.Router();
var http = require('http');

var updateUser = function(users, user, callback) {
  users.findOne({ 'username' :  user.username }),
    function(err, userupdate) {
      return callback(userupdate)
    }
}

// var delSet = function()

module.exports = function(passport, db){
  var users = db.collection("djs")

  /* GET login page. */
  router.get('/', function(req, res) {
      // Display the Login page with a flash message, if any
      res.redirect('/')
  });

  router.get('/play/:username',function(req, res) {
    if ( req.isAuthenticated() ) {
      res.render('dj', { dj : req.user })
    }
    res.redirect('/')
  })

  /* Handle Login POST */
  router.post('/signin', 
    passport.authenticate('login'), 
    function(req,res) {
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
  router.get('/home', function(req, res) {
    if ( req.isAuthenticated() ) {
      res.render('dj', {dj : req.user})
    }
    res.redirect('/')
  });

  /* Handle Logout */
  router.get('/signout', function(req, res) {
    if ( req.isAuthenticated() ) {
      req.logout();
      res.redirect('/dj');
    }
    res.redirect('/')
  });

  /* Handle New Set POST */
  router.post('/set/new', function(req, res) {
    if ( req.isAuthenticated() ) {
      users.update(
        { _id: req.user._id },
        { $push: { playlists: { title: req.body.title, songs: [] } } }
      );
      res.redirect('/dj/home');
    }
    res.redirect('/')
  });

  router.post('/set/current', function(req, res) {
    if ( req.isAuthenticated() ) {
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
                { currentPlaylist : user.playlists[0] }
              }
            )
            res.redirect('/dj/home')
          }
        }
      )
    }
    res.redirect('/')
  })

  router.post('/set/refresh', function(req, res) {
    if ( req.isAuthenticated() ) {
      users.findOne(
        {
          _id : req.user._id,
        },
        {
          playlists : { $elemMatch : { title :  req.user.currentPlaylist.title } }
        },
        function(err, user) {
          if (err) {
            console.log(err)
          }
          else {
            users.update(
              { _id : user._id },
              { $set :
                { currentPlaylist : user.playlists[0] }
              }
            )
          }
        }
      )
      res.end()
    }
    res.redirect('/')
      
  })

  router.post('/set/delete', function(req, res) {
      if ( req.isAuthenticated() ) {
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
    }
    res.redirect('/')
  })

  //   /* Handle Delete POST */
  // router.post('/delete', isAuthenticated, function(req, res) {
  //   function(req) {deactivateUser = function(){
  //         console.log("deactivate user")
  //         // find a user in Mongo with provided username
  //         User.findOne({ 'username' :  req.user.username }, function(err, user) {
  //             // In case of any error, return using the done method
  //             if (err){
  //                 console.log('Error in Deactivation: '+err);
  //                 res.redirect('/dj/home')
  //             }
  //             // User does not exist
  //             if (user == null) {
  //                 console.log('User does not exist with the username '+username);
  //                 res.redirect('/dj/home')
  //             } else {
  //                 // if there is a user with that username
  //                 // set isActive to false
  //                 // if needed, admins can fully delete accounts
  //                 user.isActive = false;
  //                 console.log("user.isActive = " + user.isActive)

  //                 // save the user
  //                 user.save(function(err) {
  //                     if (err){
  //                         console.log('Error in Saving user: '+err);  
  //                         throw err;  
  //                     }
  //                     console.log('User '+username+' is now deactivated');    
  //                     res.redirect('/')
  //                 })
  //             }
  //         })
  //     }
  //     // Delay the execution of deactivateUser and execute the method
  //     // in the next tick of the event loop
  //     process.nextTick(deactivateUser);
  //   }
  // })

  router.get('/player/:id',function(req,res,next){
    res.render('player', { title: 'Playing'});
  });

  router.get('/playlist/:id',function(req,res,next){
    res.render('djplaylist', { title: 'Playlist'});
  });

  router.all('*', function(req,res) {
    res.redirect('/')
  })

  return router;
}