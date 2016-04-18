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

    users.aggregate(
      [{ 
        $match : { _id : req.user._id }
      },
      { $unwind : "$playlists"},
      { $unwind : "$playlists.songs"},
      {
        $match : 
        {
          'playlists.title': req.user.currentPlaylist.title,
          'playlists.songs.id' : id
        }
      },
      {
        $group : 
        {
          _id : { "id" : "$playlists.songs.id" , "title" : "$playlists.songs.title", "score" : "$playlists.songs.score"},
        }
      }
      ]).toArray(function(err,song) {

        var newscore = song[0]._id.score + 1

        users.update(
        { 
          _id : req.user._id,
          'playlists.title': req.user.currentPlaylist.title
        },
        {
          $pull : { 
            'playlists.$.songs' : { id : id } 
          }
        })

        users.update(
        { 
          _id : req.user._id,
          'playlists.title': req.user.currentPlaylist.title,
        },
        {
          $push : { 
            'playlists.$.songs' : 
            {
              $each :
                [{ title: song[0]._id.title, id : id, score: newscore}],
              $sort : 1
            }  
          }
        })
      })


    res.end()
})



	return router
}
