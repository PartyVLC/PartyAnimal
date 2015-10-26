var express = require('express');
var router = express.Router();
var async = require('async');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('PartyAnimal.db');

router.get('/playlists', function(req,res,next) {
    db.each("SELECT * FROM Playlist", function(err, row){
		if (err) {
			console.log(err);
		}
		if (row && !err) {
			res.json(row);
		}
    });
});

router.get('/songs', function(req,res,next) {
    db.all("SELECT * FROM Song", function(err, rows){
    	var songs = []
    	rows.forEach(function(row) {
			if (err) {
				console.log(err);
			}
			if (row && !err) {
				songs.push(row);
			}
		});
		res.json(songs);
    });
});

router.get('/playlistsong', function(req,res,next) {
    db.all("SELECT * FROM PlaylistSong", function(err, rows){
    	var entries = []
    	rows.forEach(function(row) {
			if (err) {
				console.log(err);
			}
			if (row && !err) {
				entries.push(row);
			}
		});
		res.json(entries);
    });
});

router.get('/songsbyplaylist', function(req,res,next) {
	var playlistID = req.url.split('?')[1].slice(3);
    db.all("SELECT * FROM Song, PlaylistSong where Song.SongID=PlaylistSong.SongID and PlaylistSong.PlaylistID="+playlistID, function(err, rows){
    	var entries = []
    	if (rows) {
	    	rows.forEach(function(row) {
				if (err) {
					console.log(err);
				}
				if (row && !err) {
					entries.push(row);
				}
			});
		}
		res.json(entries);
    });
});


router.post('/addsong', function(req,res,next) {
	var stmt = "INSERT into Song (SongId,Title) VALUES ('"+req.body.id+"','"+req.body.title+"')";
	db.run(stmt);
	//stmt = "INSERT into PlaylistSong () VALUES ()";
	res.send("Song added");
});

router.post('/upvote', function(req,res,next) {
	var stmt = "UPDATE PlaylistSong SET Score=Score+1 WHERE SongID='"+req.body.id+"'";
	db.run(stmt);
	res.send("Song upvoted");
});

router.post('/downvote', function(req,res,next) {
	var stmt = "UPDATE PlaylistSong SET Score=Score-1 WHERE SongID='"+req.body.id+"'";
	db.run(stmt);
	res.send("Song downvoted");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
