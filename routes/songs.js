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
        callback(PList);
    });
}//change to look through multiple tables yay

var _getSong = function(songs, id, callback) {
    songs.find({ id: id }).toArray(function (err, SList) {
        callback(SList);
    });
}

module.exports = function(db, Playlist, Song, DJ){
	var users = db.collection("djs")
	var playlists = db.collection("playlists")
  var songs = db.collection("songs")

	//used to be /api/addsong

	/* GET Song Page */
       router.get('/add', function(req, res) {
           res.render('addsong',{message: req.flash('message')});
       })

       /* Handle Song POST */
      router.post('/add', function(req,res) {
         var title = req.body.title;
         var sid = req.body.songid;
         var pid = req.body.pid;

         // add song to songs db
         songs.update(
          { title: title, id: sid },
          { title: title,
          id: sid },
          {upsert: true}
         )

        //next update playlist db to have this new song
         _getSong(songs,sid, function(SList) {
          console.log(SList[0]._id, pid)
          playlists.findAndModify({
            query: { _id: { $oid: pid } },
            update: { $push: { songs: SList[0]._id }},
            upsert: true
           })
         })


         res.redirect('/')
       })

	return router
}
