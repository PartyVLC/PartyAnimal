var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('PartyAnimal.db');

router.get('/', function(req,res,next) {

  // var os = require('os');
  // var ifaces = os.networkInterfaces();

  // Object.keys(ifaces).forEach(function (ifname) {
  //   var alias = 0;

  //   ifaces[ifname].forEach(function (iface) {
  //     if ('IPv4' !== iface.family || iface.internal !== false) {
  //       // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
  //       return;
  //     }

  //     if (alias >= 1) {
  //       // this single interface has multiple ipv4 addresses
  //       console.log(ifname + ':' + alias, iface.address);
  //     } else {
  //       // this interface has only one ipv4 adress
  //       console.log(ifname, iface.address);
  //     }
  //     ++alias;
  //   });

  //   var options2 = {
  //     host: '',
  //     port: 3000,
  //     path: '/api/ip',
  //     method: 'GET'
  //   };
  //   var ip = http.request(options2);
  //   ip.end();

  // });

  db.run("CREATE TABLE IF NOT EXISTS Playlist (PlaylistID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT)");

  db.run("CREATE TABLE IF NOT EXISTS Song (SongID TEXT PRIMARY KEY, Title TEXT)");

  db.run("CREATE TABLE IF NOT EXISTS PlaylistSong (PlaylistID INTEGER, SongID TEXT, Score INTEGER, Idx INTEGER, FOREIGN KEY(PlaylistID) REFERENCES Playlist(PlaylistID), FOREIGN KEY(SongID) REFERENCES Song(SongID), PRIMARY KEY (PlaylistID,SongID))");

  res.render('testpages');
});

router.get('/api/getSongs', function(req,res,next) {
    db.all("SELECT * FROM Song", function(err, rows){
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
  var playlistID = req.url.split('?')[1].slice(4);
  db.all("SELECT * FROM Song, PlaylistSong, Playlist WHERE Playlist.PlaylistID=PlaylistSong.PlaylistID AND Song.SongID=PlaylistSong.SongID AND PlaylistSong.PlaylistID="+playlistID+" ORDER BY PlaylistSong.Idx", function(err, rows){
    var entries = []
    if (rows) {
      rows.forEach(function(row) {
        if (err) {
          console.log(err);
        }
        else {
          entries.push(row);
        }
      });
    }
    res.json(entries);
  });
});


router.get('/api/score',function(req,res,next) {
  var data = req.url.split('?')[1].split('&');
  sid = data[0].split('=')[1];
  pid = data[1].split('=')[1];
  db.all("select Score from PlaylistSong where PlaylistID="+pid+" AND SongID='"+sid+"'",function(err,rows){
    res.json(rows);
  });
});

router.get('/api/getPlaylists',function(req,res,next) {
  db.all("SELECT * FROM Playlist,PlaylistSong,Song WHERE (Playlist.PlaylistID=PlaylistSong.PlaylistID and Song.SongID=PlaylistSong.SongID) ORDER BY PlaylistSong.Idx",function(err,rows) {
    var playlists = {};
    for (i in rows) {
      if (playlists.hasOwnProperty(rows[i].PlaylistID)) {
        playlists[rows[i].PlaylistID].Songs.push({'Title':rows[i].Title,'SongID':rows[i].SongID,'Score':rows[i].Score,'Idx':rows[i].Idx});
      }
      else {
        playlists[rows[i].PlaylistID] = {'PlaylistName':rows[i].Name,'Songs':[{'Title':rows[i].Title,'SongID':rows[i].SongID,'Score':rows[i].Score,'Idx':rows[i].Idx}]};
      }
    }
    req.playlists = playlists;
  });
  next();
});


router.get('/api/getPlaylists',function(req,res,next) {
  db.all("select * from Playlist where Playlist.PlaylistID not in (select PlaylistID from PlaylistSong)",function(err,rows){
    for (i in rows) {
      var ekey = rows[i].PlaylistID;
      req.playlists[ekey] = {'PlaylistName':rows[i].Name,"Songs":[]};
    }
    res.json(req.playlists);
  });
});

router.post('/api/addsong', function(req,res,next) {
  var title = req.body.title.replace(/'/g,"\'\'");
  var stmt = "INSERT OR IGNORE INTO Song (SongId,Title) VALUES ('"+req.body.id+"','"+title+"')";
  db.run(stmt);

  stmt = "INSERT OR IGNORE INTO PlaylistSong (PlaylistID,SongID,Score,Idx) VALUES ("+req.body.pid+",'"+req.body.id+"',0,"+req.body.idx+")";
  db.run(stmt);

  console.log(stmt);

  res.send("Song added");
});

router.post('/api/upvote', function(req,res,next) {
  var stmt = "UPDATE PlaylistSong SET Score=Score+1 WHERE SongID='"+req.body.sid+"' AND PlaylistID="+req.body.pid;
  db.run(stmt);
  res.send("Song upvoted");
});

router.post('/api/downvote', function(req,res,next) {
  var stmt = "UPDATE PlaylistSong SET Score=Score-1 WHERE SongID='"+req.body.sid+"' AND PlaylistID="+req.body.pid;
  db.run(stmt);
  res.send("Song downvoted");
});

router.post('/api/addplaylist', function(req,res,next) {
  var name = req.body.name.replace(/'/g,"\'\'");
  var stmt = "INSERT into Playlist (Name) VALUES ('"+name+"')";
  db.run(stmt);
  res.send("Playlist created");

});

router.post('/api/deletefromplaylist', function(req,res,next) {
  var stmt = "DELETE from PlaylistSong WHERE PlaylistID="+req.body.pid+" AND SongID='"+req.body.sid+"'";
  db.run(stmt);

  db.all("SELECT * FROM PlaylistSong WHERE SongID='"+req.body.sid+"'",function(err,rows){
    if (rows.length == 0) {
      var stmt = "DELETE from Song WHERE SongID='"+req.body.sid+"'";
      db.run(stmt,function(err) {
          if(err !== null) {
            next(err);
          }
          else {
            console.log(err);
          }
      });
    }
  });

  res.send("Song deleted");
});

router.post('/api/deleteplaylist',function(req,res,next) {

  var stmt = "DELETE FROM Playlist WHERE PlaylistID="+req.body.pid;
  db.run(stmt);

  stmt = "DELETE FROM PlaylistSong WHERE PlaylistID="+req.body.pid;
  db.run(stmt);

  db.all("select * from Song where Song.SongID not in (select SongID from PlaylistSong)",function(err,rows) {
    if (rows.length != 0) {
      for (i in rows) {
        var row = rows[i];
        var stmt = "DELETE from Song WHERE SongID='"+row.SongID+"'";
        db.run(stmt);
      }
    }
  });
  res.send("Playlist deleted");
});

router.post('/api/setIdx',function(req,res,next) {
  var stmt = "UPDATE PlaylistSong SET Idx="+req.body.idx+" WHERE SongID="+req.body.sid+" AND PlaylistID="+req.body.pid;
  db.run(stmt);
});

router.get('/api/song/getNext',function(req,res,next) {
  var request = req.url.split('?')[1].split('&');
  if (request) {
    var idx = request[0].slice(4);
    var pid = request[1].slice(4);

    var qry = "select min(Idx),SongID from PlaylistSong where Idx >= "+idx+" AND PlaylistID="+pid;
    console.log(qry);
    db.all(qry,function(err,rows) {
      if (rows) {
        res.json(rows[0]);
      }
      else
        res.json(null);
    });
  }
  else {
    res.send();
  }
});

router.get('/api/getLastIdx',function(req,res,next) {
  var pid = req.url.split('?')[1].slice(4);
  db.all("select max(Idx) from PlaylistSong where PlaylistID="+pid,function(err,rows) {
    if (rows) {
      if (rows[0]["max(Idx)"])
        res.json(rows[0]["max(Idx)"]);
      else
        res.json(0);
    }
  });
});

router.get('/api/song/getIdx',function(req,res,next) {
  var result = req.url.split('?')[1].split('&');
  var pid = result[0].slice(4);
  var sid = result[1].slice(4);

  db.all("select Idx from PlaylistSong where PlaylistID="+pid+" AND SongID='"+sid+"'",function(err,rows) {
    if (rows.length !== 0)
      res.json(rows[0]["Idx"]);
    else
      res.json(0);
  })
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
