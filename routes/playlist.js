var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("made it to playlist.");
  res.render('home');
});

module.exports = router;