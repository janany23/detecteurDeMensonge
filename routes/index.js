var express = require('express');
var router = express.Router();
var net = require('net');
var io = require('socket.io');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Détecteur de mensonges' });
});

module.exports = router;
