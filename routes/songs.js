var express = require('express');
var router = express.Router();
//var ObjectID = require('mongoose').ObjectID
var ObjectId = require('mongodb').ObjectId

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
      return next();
  // if the user is not authenticated then redirect them to the login page
  res.redirect('/dj');
}

var _getSong = function(songs, id, callback) {
  songs.find({ id: id }).toArray(function (err, SList) {
      callback(SList);
  })
}

var _getSongsByOId = function(songs, oidlist, callback) {
  songs.find({ _id: {$in : oidlist }}).toArray(function (err, SList) {
    callback(SList)
  })
}

var _getPlaylist = function(playlists, pid, callback) {
  playlists.find({ _id : ObjectId(pid) }).toArray(function (err, PList) {
    callback(PList)
  })
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
   var title = req.body.title;
   var sid = req.body.sid;
   var pid = req.body.pid;

  //  // add song to songs db
  //  songs.update(
  //   { title: title, id: sid },
  //   { title: title, id: sid },
  //   { upsert: true }
  //  )

  // //next update playlist db to have this new song
  //  _getSong(songs, sid, function(SList) {
  //   playlists.update(
  //     { _id: ObjectId(pid) },
  //     { $push: { songs: SList[0]._id } }
  //    )
  //  })

   _getPlaylist(playlists,pid,function(PList) {
    playlists.update(
      { _id: ObjectId(pid) },
      { $push: { songs: { title: title, id: sid } } }
     )
   })
   res.redirect('/')
  })

	return router
}
