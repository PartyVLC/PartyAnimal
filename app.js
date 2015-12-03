var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var users = require('./routes/users');
var api = require('./routes/api');
var party = require('./routes/party');
var dj = require('./routes/dj');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/dj', dj);
app.use('/api', api);
app.use('/party', party);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var os = require('os');
var ifaces = os.networkInterfaces();
var qr = require('qr-image');

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
      var qr_svg = qr.image(iface.address + ':3000', { type: 'svg'});
      qr_svg.pipe(require('fs').createWriteStream('./public/images/ip_qr.svg'));

    }
    ++alias;
  });
});

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./PartyAnimal.db');

db.run("CREATE TABLE IF NOT EXISTS Playlist (PlaylistID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT)");
db.run("CREATE TABLE IF NOT EXISTS Song (SongID TEXT PRIMARY KEY, Title TEXT)");
db.run("CREATE TABLE IF NOT EXISTS PlaylistSong (PlaylistID INTEGER, SongID TEXT, Score INTEGER, FOREIGN KEY(PlaylistID) REFERENCES Playlist(PlaylistID), FOREIGN KEY(SongID) REFERENCES Song(SongID), PRIMARY KEY (PlaylistID,SongID))");

var userDB = new sqlite3.Database('./userDB');

userDB.run("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, salt TEXT)");

module.exports = app;
