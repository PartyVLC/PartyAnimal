var express = require('express');
var router = express.Router();
var models  = require('../models');

router.post('/create', function(req, res) {
  models.User.create({
    username: req.body.username
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:user_id/delete', function(req, res) {
  models.User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

router.post('/:user_id/playlists/create', function (req, res) {
  models.Playlist.create({
    title: req.body.title,
    UserId: req.params.user_id
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:user_id/playlists/:playlist_id/destroy', function (req, res) {
  models.Playlist.destroy({
    where: {
      id: req.params.playlist_id
    }
  }).then(function() {
    res.redirect('/');
  });
});


module.exports = router;




/* GET users listing. */
router.get('/', function(req, res, next) {
  // console.log("made it to users.");
  res.render('home');
});

router.get('/party/:partyID', function(req, res, next) {
  res.send("Viewing "+req.params.partyID);
});

module.exports = router;
