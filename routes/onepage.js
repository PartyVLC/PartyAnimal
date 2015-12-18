var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');

router.get('/',function(req,res,next){
	res.render('onepage', { title: '' });
});

module.exports = router;