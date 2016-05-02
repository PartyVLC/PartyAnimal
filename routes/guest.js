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

  router.post('/party', function(req, res, next) {
    console.log(req.body.djid)
  	res.redirect('party/'+req.body.djid);
  })

  router.get('/party/:username', function(req, res) {

  	var dj = users.findOne(
      { "username": req.params.username },
      { "password": 0},
      function(err, document) {
        console.log(req.params.username)
      	if (document == null) {
      		res.redirect('/guest')
      	}
      	else {
          console.log(document._id)
          var qr = require('qr-image');
          var qr_svg = qr.image('www.yourpartyanimal.com/guest/party/'+document.username, { type: 'svg'});
          qr_svg.pipe(require('fs').createWriteStream('./public/images/'+document._id+'.svg'));
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

  return router;
}