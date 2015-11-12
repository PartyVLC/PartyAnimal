var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');

router.get('/player/:id',function(req,res,next){
	res.render('player', { title: 'Playing' });
});

router.get('/playlist/:id',function(req,res,next){
	res.render('playlist', { title: 'Playlist' });
});

module.exports = router;