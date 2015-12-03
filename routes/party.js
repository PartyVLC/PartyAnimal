var express = require('express');
var restapi = express();
var router = express.Router();
var async = require('async');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('PartyAnimal.db');

/* GET player page. */
router.get('/', function(req, res, next) {
  //  /party
  res.render('player');
});

router.get('/:partyID', function(req, res, next) {
  //  /party/6969  <- gives access to control the currently playing playlist under UserID 6969
  res.render('player');
});

module.exports = router;