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

module.exports = function(db){
	var users = db.collection("djs")

  /* Add Song to Playlist POST */
  router.post('/add', function(req,res) {
    var title = req.body.title
    var id = req.body.id

    users.update(
    { 
      _id : req.user._id,
      'playlists.title': req.user.currentPlaylist.title
    },
    {
      $push : { 
        'playlists.$.songs' : { title: title, id : id, score: 0 } 
      }
    })

    res.end()
    
  })

  router.post('/delete', function(req,res) {
    var id = req.body.id

    users.update(
    {
      _id : req.user._id,
      'playlists.title' : req.user.currentPlaylist.title
    },
    {
      $pull : {
        'playlists.$.songs' : { id : id }
      }
    })

    res.end()
  })

  router.post('/upvote', function(req,res) {
    var id = req.body.id

    users.updateOne(
      {
        _id : req.user._id,
        'currentPlaylist.songs.id' : id
      },
      {
        $inc : 
        {
          'currentPlaylist.songs.$.score' : 1
        }
      }
    )
    res.end()
  })

  router.post('/downvote', function(req,res) {
    var id = req.body.id

    users.updateOne(
      {
        _id : req.user._id,
        'currentPlaylist.songs.id' : id
      },
      {
        $inc : 
        {
          'currentPlaylist.songs.$.score' : -1
        }
      },
      function(err, res) {
        users.findOne(
          {
            _id : req.user._id,
            'currentPlaylist.songs.id' : id
          },
          {
            'currentPlaylist.songs.$' : 1
          },
          function(err, user) {
            if (user.currentPlaylist.songs[0].score < -4) {
                users.updateOne(
                {
                  _id : user._id
                },
                {
                  $pull : {
                    'currentPlaylist.songs' : { id : id }
                  }
                }
              )
            }
          }
        )
      }
    )
    res.end()
  })

	return router
}
