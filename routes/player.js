var express = require('express');
var router = express.Router();
var async = require('async');

/* GET player page. */
router.get('/', function(req, res, next) {
  res.render('player', { title: 'Playing' });
});

module.exports = router;