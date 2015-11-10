var express = require('express');
var router = express.Router();
var async = require('async');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('PartyAnimal.db');

router.get('/:id', function(req, res, next) {
	console.log("Getting your playlist: " + req.params.id);
	res.render('player', { title: 'Playing Playlist ' + req.params.id });
});

module.exports = router;