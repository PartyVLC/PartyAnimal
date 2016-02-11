console.log(process.env.prefix)

var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');

router.get('/player/:id',function(req,res,next){
	res.render('player', { title: 'Playing' , prefix: process.env.prefix});
});

router.get('/playlist/:id',function(req,res,next){
	res.render('djplaylist', { title: 'Playlist' , prefix: process.env.prefix});
});

router.get('/login',function(req,res,next){
	res.render('login', { title: 'Log in' , prefix: process.env.prefix});
});

module.exports = router;