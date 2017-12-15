var express = require('express');
var router = express.Router();
var net = require('net');
var io = require('socket.io');
var db = require('./mongo')



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Détecteur de mensonges' });
});

router.post('/hello', function(req, res, next) {
  res.render('index', { title: 'Détecteur de mensonges' });
  console.log(req.body);
  console.log(req.query);
});

module.exports = router;
