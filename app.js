var express = require('express');
var router = express.Router();
var socket_io    = require( "socket.io" );
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

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
var session = require('express-session')({ secret: 'G0N0r$3', resave: false, saveUninitialized: false });
app.use(express.static(path.join(__dirname, 'public')));

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/dj', dj);
app.use('/guest', guest);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
// mongoose.connect('mongodb://partyanimal:G0N0rs3!15@ds059365.mongolab.com:59365/partyanimal');
var mongodbUri = 'mongodb://michael:408999@ds059365.mongolab.com:59365/partyanimal';
mongoose.connect(mongodbUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// db.once('open', function callback () {

//   // Create song schema
//   var songSchema = mongoose.Schema({
//     decade: String,
//     artist: String,
//     song: String,
//     weeksAtOne: Number
//   });

//   // Store song documents in a collection called "songs"
//   var Song = mongoose.model('songs', songSchema);

//   // Create seed data
//   var seventies = new Song({
//     decade: '1970s',
//     artist: 'Debby Boone',
//     song: 'You Light Up My Life',
//     weeksAtOne: 10
//   });

//   var eighties = new Song({
//     decade: '1980s',
//     artist: 'Olivia Newton-John',
//     song: 'Physical',
//     weeksAtOne: 10
//   });

//   var nineties = new Song({
//     decade: '1990s',
//     artist: 'Mariah Carey',
//     song: 'One Sweet Day',
//     weeksAtOne: 16
//   });

//   /*
//    * First we'll add a few songs. Nothing is required to create the 
//    * songs collection; it is created automatically when we insert.
//    */
//   seventies.save();
//   eighties.save();
//   nineties.save();

//   /*
//    * Then we need to give Boyz II Men credit for their contribution
//    * to the hit "One Sweet Day".
//    */
//   Song.update({ song: 'One Sweet Day'}, { $set: { artist: 'Mariah Carey ft. Boyz II Men'} }, 
//     function (err, numberAffected, raw) {

//       if (err) return handleError(err);

//       /*
//        * Finally we run a query which returns all the hits that spend 10 or
//        * more weeks at number 1.
//        */
//       Song.find({ weeksAtOne: { $gte: 10} }).sort({ decade: 1}).exec(function (err, docs){

//         if(err) throw err;

//         docs.forEach(function (doc) {
//           console.log(
//             'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] + 
//             ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
//           );
//         });

//         // Since this is an example, we'll clean up after ourselves.
//         mongoose.connection.db.collection('songs').drop(function (err) {
//           if(err) throw err;

//           // Only close the connection when your app is terminating
//           mongoose.connection.db.close(function (err) {
//             if(err) throw err;
//           });
//         });
//       });
//     }
//   )
// });

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

// var morgan = require('morgan')('combined');
// var cp = require('cookie-parser')();
// var bp = require('body-parser').urlencoded({ extended: true });
// var session = require('express-session')({ secret: 'G0N0r$3', resave: false, saveUninitialized: false });


// app.use(passport.initialize());
// app.use(passport.session());

// models.users.verify();

// //////////////////////////////////////////////////////

// // Login via Passport-Local

// passport.use(new Strategy(
//   function(username, password, done) {
//     models.users.findByUsername(username, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false, { message: "Username does not exist!" }); }
//       console.log(user);
//       if (!models.users.verifyPassword(user, password)) { return done(null, false, { message: "Incorrect Username/Password!" }); }
//       return done(null, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, cb) {
//   cb(null, user.id);
// });

// passport.deserializeUser(function(id, cb) {
//   db.users.findById(id, function (err, user) {
//     if (err) { return cb(err); }
//     cb(null, user);
//   });
// });

module.exports = app;
