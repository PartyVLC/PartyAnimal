var express = require('express');
var router = express.Router();
var http = require('http');

// router.get('party/:partyID//:activePlaylistID',function(req,res,next){
// 	res.render('guestplaylist', { partyID: 'Playlist', activePlaylistID : req.params.activePlaylistID , prefix: process.env.prefix});
// });

module.exports = function(db, Playlist, Song){
  var users = db.collection("djs")

  /* GET guest landing page. */
  router.get('/', function(req, res) {
      // Display the Login page with any flash message, if any
      res.redirect('/')
  });

  //  post from landing form, redirect to username
  router.post('/party', function(req, res, next) {
  	res.redirect('party/'+req.body.djid);
  })

  //  get user from db and render data, listen for socket
  router.get('/party/:username', function(req, res) {

  	var dj = users.findOne(
      { "username": req.params.username },
      { "password": 0},
      function(err, document) {
      	if (document == null) {
      		res.redirect('/guest')
      	}
      	else {
	        res.render('guest', { dj : document } )
    	}
      });
  });

  router.post('/dj_data', function(req, res) {
    users.findOne(
      { username : req.body.dj },
      { password : 0 },
      function(err, user) {
        if(err) {
          res.send(err)
        }
        else {
          res.json(user);
        }
      })
  });

  router.get('/*', function(req, res) {
    console.log("not valid")
    res.redirect('/')
  })

  return router;
}