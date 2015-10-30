var express = require('express');
var restapi = express();
var router = express.Router();
var async = require('async');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('PartyAnimal.db');

/* GET player page. */
router.get('/', function(req, res, next) {
  // console.log("Checking if Tables exist in Database...")
  
  // db stuff
  db.run("CREATE TABLE IF NOT EXISTS Playlist (PlaylistID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT)");

  db.run("CREATE TABLE IF NOT EXISTS Song (SongID TEXT PRIMARY KEY, Title TEXT)");

  db.run("CREATE TABLE IF NOT EXISTS PlaylistSong \
    (PlaylistID INTEGER, \
    SongID TEXT, \
    Score INTEGER, \
    FOREIGN KEY(PlaylistID) REFERENCES Playlist(PlaylistID), \
    FOREIGN KEY(SongID) REFERENCES Song(SongID))");
});

module.exports = router;