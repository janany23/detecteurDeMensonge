/**
 * Created by Janany on 23/11/2017.
 */
var express = require('express');
var router = express.Router();
var db = require('./mongo');
var exec = require('child_process').exec;
var ObjectId = require('mongodb').ObjectID;
var net = require('net');
var io = require('socket.io');


/* GET questions listing. */
router.get('/', function(req, res, next) {
    var connection = db.getconnection();
    connection.collection("questions").find().toArray(function (error, questions) {
        if (error) throw error;
        //questions.forEach(function(obj, i) {
        //    console.log(
        //        "ID : "  + obj._id.toString() + "\n"
        //        + "Question "+(i+1)+" : " + obj.intitule + "\n"
        //        + "Resultat "+(i+1)+" : " + obj.resultat + "\n"
        //        + "Reponse "+(i+1)+" : " + obj.reponse + "\n"
        //    );
        //});
        res.render('test', {
            questions: questions
        });
    });
});

/* ADD a question. */
router.get('/playQuestion', function(req, res, next) {
    var connection = db.getconnection();

    var id = req.query.questionId;
    connection.collection("questions").find({ "_id" : ObjectId(id) }).toArray(function(err, result) {
        if (err) throw err;
        var question = result[0].intitule;
        console.log(question);
        exec('sh ./scripts/dit.sh "'+ question + '"', function (error, stdout, stderr)
            {
                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    console.log('exec error:' + error);
                }
            }
        );

    });

    //questions.forEach(function(obj, i) {
    //    console.log(
    //        "ID : "  + obj._id.toString() + "\n"
    //        + "Question "+(i+1)+" : " + obj.intitule + "\n"
    //    );
    //});
    res.redirect('/');
    //});
});

router.post('/postResponse', function(req, res, next) {
    console.log(req.body);
    console.log(req.body.idQuestion);

    //var connection = db.getconnection();
    //connection.collection("questions").find().toArray(function (error, questions) {
    //    if (error) throw error;
    //    //console.log(questions[req.body.idQuestion].intitule);
    //    connection.collection("questions").updateOne(
    //        { intitule : questions[req.body.idQuestion].intitule },
    //        {
    //            intitule : questions[req.body.idQuestion].intitule,
    //            resultat : req.body.reponse
    //        }
    //    );
    //    questions.forEach(function(obj, i) {
    //        console.log(
    //            "ID : "  + obj._id.toString() + "\n"
    //            + "Question "+(i+1)+" : " + obj.intitule + "\n"
    //        );
    //
    //    });

    //Socket client creation
    var client = new net.Socket();

    //socket client connect to raspberry server
    client.connect(3001, "172.20.10.8", function () {
        console.log('CONNECTED TO: 172.20.10.8:3001');
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
        client.write('POST');
        //res.sendStatus(200);
        //res.render('data.twig', { title: 'RECEIVE DATA FROM RASPBERRY' });
    });
    var io = req.app.get('socketio');
    client.on('data', function (data) {
        console.log('DATA: ' + data);
        console.log(io.connectedStatus);
        if(io.connectedStatus==null || io.connectedStatus==true) {
            io.emit('newData', {test:'hello world!'});
        } else {
            console.log('Destruction du socket');
            client.destroy();
        }
    });
    res.sendStatus(200);
});

module.exports = router;