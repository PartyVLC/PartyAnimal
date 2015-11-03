var express = require('express');
var restapi = express();
var router = express.Router();
var async = require('async');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('PartyAnimal.db');

/* GET player page. */
router.get('/', function(req, res, next) {
  // console.log("Checking if Tables exist in Database...")

  var os = require('os');
  var ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
      }
      ++alias;
    });
  });
  
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