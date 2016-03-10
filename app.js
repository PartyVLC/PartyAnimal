process.env['prefix'] = 'www';

var express = require('express');
var socket_io = require( "socket.io" );
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//////////////////////////////////////////////////////
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(logger('tiny'));

// passport config
var DJ = require('./models/dj');
var Playlist = require('./models/playlist');
var Song = require('./models/song');
var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({ secret: 'G0N0r$3', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport/init');
initPassport(passport);

// ***** mongoose configs *****
var mongoose = require('mongoose');
//var mongodbUri = process.env.MONGO;
var mongodbUri = 'mongodb://michael:408999@ds059365.mongolab.com:59365/partyanimal';
mongoose.connect(mongodbUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


// ***** configs *****
var flash = require('connect-flash');
app.use(flash());

var index = require('./routes/index');
var dj = require('./routes/dj')(passport, db, Playlist, Song);
var guest = require('./routes/guest');
var songs = require('./routes/songs')(db, Playlist, Song, DJ);

app.use('/', index);
app.use('/dj', dj);
app.use('/guest', guest);
app.use('/songs', songs);

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'Party_Hat.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }));
app.use(cookieParser());
app.use(logger('dev'));

// ***** catch 404 and forward to error handler *****
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// ***** development error handler *****
// ******* will print stacktrace *******
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// ******** production error handler ********
// ****** no stacktraces leaked to user *****
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var qr = require('qr-image');
var qr_svg = qr.image('mongo' + '.yourpartyanimal.com/guest/1', { type: 'svg'});
qr_svg.pipe(require('fs').createWriteStream('./public/images/guest_qr.svg'));

// Object.keys(ifaces).forEach(function (ifname) {
//   var alias = 0;

//   ifaces[ifname].forEach(function (iface) {
//     if ('IPv4' !== iface.family || iface.internal !== false) {
//       // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
//       return;
//     }

//     if (alias >= 1) {
//       // this single interface has multiple ipv4 addresses
//       //console.log(ifname + ':' + alias, iface.address);
//     } else {
//       // this interface has only one ipv4 adress
//       console.log(ifname, iface.address);
//       var qr_svg = qr.image(iface.address + ':3000', { type: 'svg'});
//       qr_svg.pipe(require('fs').createWriteStream('./public/images/ip_qr.svg'));
//     }
//     ++alias;
//   });
// });

// ***** Extra DB Doc *****

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

// console.log(process.env.DOMAIN);

module.exports = app;
