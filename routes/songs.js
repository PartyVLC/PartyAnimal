var express = require('express')
var router = express.Router()
var ObjectId = require('mongodb').ObjectId

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
      return next()
  // if the user is not authenticated then redirect them to the login page
  res.redirect('/dj')
}

module.exports = function(db, Playlist, Song, DJ){
	var users = db.collection("djs")
	var playlists = db.collection("playlists")
  var songs = db.collection("songs")

  /* GET Song Page */
  router.get('/add', function(req, res) {
     res.render('addsong',{message: req.flash('message')});
  })

  /* Add Song to Playlist POST */
  router.post('/add', function(req,res) {
   var title = req.body.title
   var sid = req.body.sid
   var pname = req.body.pname

    users.update(
      { 
        _id : req.user._id,
        'playlists.title': pname
      },
      {
        $push : { 
          'playlists.$.songs' : { title: title, id : sid } 
        }
      },
      function(err, result) {
        if (err) {
          console.log(err)
        }
      }
    )

    res.redirect('/')
  })

  // probs should test this at some point
  router.post('/delete', function(req,res) {
    var id = req.body.id
    var pname = req.body.pname

    users.update(
    {
      _id : id,
      'playlists.title' : pname
    },
    {
      $pull : {
        'playlists.$.songs' : { id : id }
      }
    },
    function(err,result) {
      if (err) {
        console.log(err)
      }
    })
    res.redirect('/')
  })

	return router
}
