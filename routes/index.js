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
			console.log(row.PlaylistID);
			console.log(row.Name);
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

router.post('/addsong', function(req,res,next) {
	var stmt = "INSERT into Song (SongId,Title) VALUES ('"+req.body.id+"','"+req.body.title+"')";
	console.log(stmt);
	db.run(stmt);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
