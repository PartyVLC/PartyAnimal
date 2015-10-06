var express = require('express');
var router = express.Router();
var async = require('async');

/* GET player page. */
router.get('/', function(req, res, next) {
  locals.id = 'dQw4w9WgXcQ';
  res.render('player', { title: 'Playing' });
});

module.exports = router;