var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('./userDB');

function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

function lookupUser(username) {
  db.get('SELECT username FROM Users WHERE username = ?', username, function(err, row) {
    if (row) return true;
    return false;
  })
};

function createUser(username, hash, salt) {
  var stmt = "INSERT INTO Users (username, password, salt) VALUES ('"+username+"', )"
}

passport.use(new LocalStrategy(function(username, password, done) {
  db.get('SELECT salt FROM Users WHERE username = ?', username, function(err, row) {
    if (!row) return done(null, false);
    var hash = hashPassword(password, row.salt);
    db.get('SELECT username, id FROM Users WHERE username = ? AND password = ?', username, hash, function(err, row) {
      if (!row) return done(null, false);
      return done(null, row);
    });
  });
}));

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.get('SELECT id, username FROM users WHERE id = ?', id, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

router .post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

/* GET User page. */
router.get('/login', function(req, res, next) {
  res.render('login', { user: 'Michael' });
});

router.get('/logout', function(req, res, next) {
  res.render('logout');
});

router.post('/register', function(req, res, next) {
  var user = req.body;

  if (lookupUser(user.username)) res.render('register', {title: 'register', errorMessage: 'username already exists'});

  else {
    var salt = '';
    var hash = hashPassword(user.password, salt);

    var newUser = createUser(user.username, hash, salt);
    res.render('player', {title: 'Login Successful'});
  };
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/', function(req, res, next) {
  console.log("routing to /");
  res.redirect('/');
});

router.get('/:id', function(req, res, next) {
    res.render('dj');
});

module.exports = router;