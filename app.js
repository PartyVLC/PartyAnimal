var express = require('express');
var router = express.Router();
var socket_io    = require( "socket.io" );
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var models = require('./models');

//////////////////////////////////////////////////////
var app = express();

var routes = require('./routes/index');
//var player = require('./routes/player');
var dj = require('./routes/dj');
var guest = require('./routes/guest');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/dj', dj);
app.use('/guest', guest);

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
      //console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
      var qr_svg = qr.image(iface.address + ':3000', { type: 'svg'});
      qr_svg.pipe(require('fs').createWriteStream('./public/images/ip_qr.svg'));
    }
    ++alias;
  });
});

// Initialize Passport and restore authentication state, if any, from the
// session.

var morgan = require('morgan')('combined');
var cp = require('cookie-parser')();
var bp = require('body-parser').urlencoded({ extended: true });
var session = require('express-session')({ secret: 'G0N0r$3', resave: false, saveUninitialized: false });
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

//////////////////////////////////////////////////////

// Login via Passport-Local

passport.use(new Strategy(
  function(username, password, done) {
    models.users.findByUsername(username, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: "Username does not exist!" }); }
      console.log(user);
      if (!models.users.verifyPassword(user, password)) { return done(null, false, { message: "Incorrect Username/Password!" }); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

module.exports = app;
