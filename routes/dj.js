var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/dj');
}

module.exports = function(passport, db, DJSet, Song){

    /* GET login page. */
    router.get('/', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('dj_index', { message: req.flash('message') });
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
        res.render('dj_home', { user: req.user });
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/dj');
    });

    /* Handle New Set POST */
    router.get('/set/new', isAuthenticated, function(req, res) {
        
      var insertDocument = function(db, callback) {
        db.collection('playlists').insertOne( {
          "title": "Stuffy Stuff",
          "users": [req.user._id],
          "songs": []
        }, function(err, result) {
          assert.equal(err, null);
          console.log("Inserted a doc into DJSets collection.");
          callback();
        });
      }
      res.render('dj_home', { user: req.user });
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