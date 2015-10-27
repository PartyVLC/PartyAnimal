var express = require('express');
var router = express.Router();
var async = require('async');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('PartyAnimal.db');

router.get('/playlists', function(req,res,next) {
    db.all("SELECT * FROM Playlist", function(err, rows){
    	var playlists = [];
    	rows.forEach(function(row) {
			if (err) {
				console.log(err);
			}
			if (row && !err) {
				playlists.push(row);
			}
		});
		res.json(playlists);
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

router.get('/songsbyplaylist', function(req,res,next) {
	var playlistID = req.url.split('?')[1].slice(3);
	console.log(playlistID);
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

router.get('/api/emptyplaylists',function(req,res,next) {
	db.all("select * from Playlist where Playlist.PlaylistID not in (select PlaylistID from PlaylistSong)",function(err,rows){
		res.json(rows);
	});

});

router.get('/api/playlists',function(req,res,next) {
	db.all("SELECT * FROM Playlist,PlaylistSong,Song WHERE (Playlist.PlaylistID=PlaylistSong.PlaylistID and Song.SongID=PlaylistSong.SongID)",function(err,rows) {
		var playlists = {};
		for (i in rows) {
			if (playlists.hasOwnProperty(rows[i].PlaylistID)) {
				playlists[rows[i].PlaylistID].Songs.push({'Title':rows[i].Title,'SongID':rows[i].SongID,'Score':rows[i].Score});
			}
			else {
				playlists[rows[i].PlaylistID] = {'PlaylistName':rows[i].Name,'Songs':[{'Title':rows[i].Title,'SongID':rows[i].SongID,'Score':rows[i].Score}]};
			}
		}
		res.json(playlists);
	});
});


router.post('/addsong', function(req,res,next) {
	var stmt = "INSERT into Song (SongId,Title) VALUES ('"+req.body.id+"','"+req.body.title+"')";
	db.run(stmt);
	stmt = "INSERT into PlaylistSong (PlaylistID,SongID,Score) VALUES ("+req.body.pid+",'"+req.body.id+"',0)";
	db.run(stmt);
	res.send("Song added");
});

router.post('/upvote', function(req,res,next) {
	var stmt = "UPDATE PlaylistSong SET Score=Score+1 WHERE SongID='"+req.body.sid+"' AND PlaylistID="+req.body.pid;
	db.run(stmt);
	res.send("Song upvoted");
});

router.post('/downvote', function(req,res,next) {
	var stmt = "UPDATE PlaylistSong SET Score=Score-1 WHERE SongID='"+req.body.sid+"' AND PlaylistID="+req.body.pid;
	db.run(stmt);
	res.send("Song downvoted");
});

router.post('/addplaylist', function(req,res,next) {
	var stmt = "INSERT into Playlist (Name) VALUES ('"+req.body.name+"')";
	db.run(stmt);
	res.send("Playlist created");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
