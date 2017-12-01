var express = require('express');
var router = express.Router();
var net = require('net');
var io = require('socket.io');
var exec = require('child_process').exec;


/* GET home page. */
router.get('/', function(req, res, next) {

  var yourscript = exec('sh dit.sh "Hello world!"',
        (error, stdout, stderr) =>
        {
                console.log(`${stdout}`);
                console.log(`${stderr}`);
          if (error !== null) {
            console.log(`exec error: ${error}`);
          }
        }
  );

  //var cmd = "ls";
  //var options = {
  //  encoding: 'utf8'
  //};
  //console.log(exec('dit.sh', options))
  res.render('index', { title: 'Détecteur de mensonges' });
});

module.exports = router;
