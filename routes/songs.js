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

module.exports = function(db, Playlist, Song, DJ){
	var users = db.collection("djs")
	var playlists = db.collection("playlists")
  var songs = db.collection("songs")

	//used to be /api/addsong

	/* GET Song Page */
       router.get('/add', function(req, res) {
           res.render('addsong',{message: req.flash('message')});
       });

       /* Handle Song POST */
      router.post('/add', function(req,res) {
         var title = req.body.title;
         var id = req.body.songid;
         var newS = new Song({
           title:title,
           id:id
         });
          
         //change this to update
         newS.save(function (err) {
           if (err) return handleError(err);
         })

        //next update playlist to have this new song
         res.redirect('/');
       });


	return router;
}
