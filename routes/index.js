var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('PartyAnimal.db');

router.get('/', function(req,res,next) {
  var options = {
    hostname: '',
    port: 3000,
    path: '/dbcheck',
    method: 'GET'
  };
  var req = http.request(options, function(res) {});
  req.end();

  res.render('player', { title: 'Playing' });
})

router.get('/api/getSongs', function(req,res,next) {
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

router.get('/api/playlistsong', function(req,res,next) {
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

router.get('/api/getSongsByPlaylist', function(req,res,next) {
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

router.get('/api/emptyPlaylists',function(req,res,next) {
    db.all("select * from Playlist where Playlist.PlaylistID not in (select PlaylistID from PlaylistSong)",function(err,rows){
        res.json(rows);
    });
});

router.get('/api/getPlaylists',function(req,res,next) {
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

router.post('/api/addsong', function(req,res,next) {
    var stmt = "INSERT into Song (SongId,Title) VALUES ('"+req.body.id+"','"+req.body.title+"')";
    db.run(stmt);
    stmt = "INSERT into PlaylistSong (PlaylistID,SongID,Score) VALUES ("+req.body.pid+",'"+req.body.id+"',0)";
    db.run(stmt);
    res.send("Song added");
});

router.post('/api/upvote', function(req,res,next) {
    var stmt = "UPDATE Song SET Score=Score+1 WHERE SongID='"+req.body.sid+"' AND PlaylistID="+req.body.pid;
    db.run(stmt);
    res.send("Song upvoted");
});

router.post('/api/downvote', function(req,res,next) {
    var stmt = "UPDATE PlaylistSong SET Score=Score-1 WHERE SongID='"+req.body.sid+"' AND PlaylistID="+req.body.pid;
    db.run(stmt);
    res.send("Song downvoted");
});

router.post('/api/addplaylist', function(req,res,next) {
    var stmt = "INSERT into Playlist (Name) VALUES ('"+req.body.name+"')";
    db.run(stmt);
    console.log("Inserted New Playlist: " + req.body.name)
    res.send("Playlist created");
});

/**
    Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
    
    var flashMessages = {
        info: req.flash('info'),
        success: req.flash('success'),
        warning: req.flash('warning'),
        error: req.flash('error')
    };
    
    res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
    
    next();
    
};

module.exports = router;
