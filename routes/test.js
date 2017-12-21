/**
 * Created by Janany on 23/11/2017.
 */
var express = require('express');
var router = express.Router();
var db = require('./mongo');
// var exec = require('child_process').exec;
var ObjectId = require('mongodb').ObjectID;
var exec = require('exec-then');
var net = require('net');
var io = require('socket.io');
var url = require('url');
var request = require('request');


/* GET questions listing. */
router.get('/', function(req, res, next) {
    var connection = db.getconnection();
    //get all question from mongoDb
    connection.collection("questions").find().toArray(function (error, questions) {
        if (error) throw error;
        //render all the question
        res.render('test', {
            title: 'Begin test',
            questions: questions
        });
    });
});

/* Play a question. */
router.get('/playQuestion', function(req, res, next) {
    var connection = db.getconnection();
    var io = req.app.get('socketio');
    var id = req.query.questionId;

    //get question by id
    connection.collection("questions").find({ "_id" : ObjectId(id) }).toArray(function(err, result) {
        if (err) throw err;
        var question = result[0].intitule;
        console.log(question);

        //execute scipt to listen to the question
        exec('sh ./scripts/dit.sh "'+ question + '"', function (res, deferred)
            {
                console.log('dit.sh');
                console.log(res.stdout);
                if (res.err !== null) {
                    console.log('exec error1 :');
                    console.log(res.err);
                }
                return true;
            }
        ).then(function(r) {
            if (r) {
                //execute script to record to the answer
                exec('sh ./scripts/recording.sh '+ id, function (res, deferred)
                    {
                        console.log('recording.sh');
                        console.log(res.stdout);
                        if (res.err !== null) {
                            console.log('exec error1 :');
                            console.log(res.err);
                        }

                    }
                );
            }
        });

        //call arduino server to get data
        request('http://172.20.10.3:80', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var responseArdui = JSON.parse(body);
                console.log(responseArdui[0].resultat);



                //socket server emit the date from ardui
                io.emit('data', {resultat: responseArdui[0].resultat, question: id});
            } else {
                console.log('error try to get http://172.20.10.3:8 : ' + error.code);
            }
        });

    });

    res.redirect('/');
});

router.get('/playReponse', function(req, res, next) {
    var id = req.query.questionId;

    //execute scipt to record to the answer
    exec('sh ./scripts/playAnswer.sh '+ id + '.wav', function (error, stdout, stderr)
        {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log('exec error:' + error);
            }
        }
    );

    res.redirect('/');
});

router.get('/finishTest', function(req, res, next) {
    console.log('/finishTest');
    res.redirect('/');
});

module.exports = router;
