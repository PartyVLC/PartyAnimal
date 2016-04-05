var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect them to the login page
    res.redirect('/dj');
}

var _getMsg = function(playlists, user, callback) {
    playlists.find({ _creator: user._id }).toArray(function (err, PList) {
      callback(PList)
    });
}//change to look through multiple tables yay

var _getPlaylists = function(playlists, songs, dj, callback) {
  _getPlaylistsFromOIDs(playlists, songs, dj.playlists, function(PList) {
    callback(PList)
  })
}

var _getPlaylistsFromOIDs = function(playlists, songs, oidlist, callback) {
  playlists.find({ _id : {$in : oidlist}}).toArray(function (err, PList) {
    // for (i in PList) {
    //   _getSongs(songs, PList[i].songs, function(SList) {
    //     PList[i].songs = SList
    //   })
    // }
    callback(PList)
  })

}

var _getSongs = function(songs, oidlist, callback) {
  songs.find({ _id: {$in : oidlist }}).toArray(function (err, SList) {
    callback(SList)
  })
}


module.exports = function(db, Playlist, Song, DJ){
  var users = db.collection("djs")
  var playlists = db.collection("playlists")
  var songs = db.collection("songs")

  // Renders the dj playlist
  router.get('/', function(req,res) {
    _getPlaylists(playlists, songs, req.user, function(plists) {
      console.log(plists)
      res.render('djplaylist_test', {playlists: plists })
    })
  })

  // I don't think we want this anymore
  router.get('/dj/:dj', function(req, res) {
    var djID = req.params.dj
    _getPlaylists(users, songs, djID, function(playlists) {
      res.json(playlists)
    })
  })

  return router;
}
