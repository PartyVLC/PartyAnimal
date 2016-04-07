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
          { $push: { playlists: {title: req.body.title, songs: []} } }
        )
        res.redirect('/dj/home')
    });

    //I made this one for deleting..
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

    // // What the fuck is this?
    // router.get('/set/delete/:id', isAuthenticated, function(req, res) {
    //     var path = '/dj/set/'+req.params.id;
    //     var options = {
    //         host: 'localhost',
    //         port: '5000',
    //         path: path,
    //         method: 'delete'
    //     };
    //     callback = function(response) {
    //       var str = ''
    //       response.on('data', function (chunk) {
    //         str += chunk;
    //       });

    //       response.on('end', function () {
    //         console.log(str);
    //         //res.redirect('/dj/home');
    //       });
    //     }
    //     console.log('ID: '+ req.params.id);
    //     http.request(options, callback).end();
    //     //res.redirect('/dj/home')
    // })

    // /* Handle Delete Set */
    // router.delete('/set/:id', isAuthenticated, function(req, res) {
    //     console.log('ID: '+ req.params.id);
    //     console.log('From: '+ req.user.playlists)
    //   //if (req.params.id in req.user.playlists) {
    //     console.log("Index: "+req.user.playlists.indexOf(req.params.id))
    //     if (req.user.playlists.indexOf(req.params.id)) {
    //         console.log('Deleting '+req.params.id)
    //         users.findAndModify(
    //             { _id: req.user._id },
    //             { $remove: { playlists: req.params.id }}
    //         );
    //         playlists.remove(
    //             { _id: req.params._id },
    //             { justOne: true }
    //         )
    //         }
    //  //        console.log('Deleting '+req.params.id)
    //   //  users.findAndModify(
    //   //    { _id: req.user._id },
    //   //    { remove: { playlists: req.params.id }}
    //   //  );
    //   //  playlists.remove(
    //   //    { _id: req.params._id },
    //   //    { justOne: true }
    //   //  )
    //   // }
    //     //res.send(req.body.id)
    //     res.redirect('/dj/home');
    // });

  router.get('/player/:id',function(req,res,next){
    res.render('player', { title: 'Playing'});
  });

  router.get('/playlist/:id',function(req,res,next){
    res.render('djplaylist', { title: 'Playlist'});
  });

    return router;
}

// ***** Extra DB Doc *****

// db.once('open', function callback () {

//   // Create song schema
//   var songSchema = mongoose.Schema({
//     decade: String,
//     artist: String,
//     song: String,
//     weeksAtOne: Number
//   });

//   // Store song documents in a collection called "songs"
//   var Song = mongoose.model('songs', songSchema);

//   // Create seed data
//   var seventies = new Song({
//     decade: '1970s',
//     artist: 'Debby Boone',
//     song: 'You Light Up My Life',
//     weeksAtOne: 10
//   });

//   var eighties = new Song({
//     decade: '1980s',
//     artist: 'Olivia Newton-John',
//     song: 'Physical',
//     weeksAtOne: 10
//   });

//   var nineties = new Song({
//     decade: '1990s',
//     artist: 'Mariah Carey',
//     song: 'One Sweet Day',
//     weeksAtOne: 16
//   });