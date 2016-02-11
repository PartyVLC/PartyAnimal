var express = require('express');
var router = express.Router();

/* GET User page. */
router.get('/login', function(req, res, next) {
  console.log(process.env.prefix);
  res.render('login', { title: 'Login' , prefix: process.env.prefix});
});