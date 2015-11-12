var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');

router.get('/:partyID/:activePlaylistID',function(req,res,next){
	res.render('playlist', { title: 'Playlist' });
});

module.exports = router;