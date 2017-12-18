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
var url = require('url');
var request = require('request');


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

/* Play a question. */
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

        request('http://172.20.10.3:80', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body); // Print the body of response.
                var res = JSON.parse(body);
                console.log(res);
                console.log(res.resultat);

                var resp = JSON.stringify(body);
                console.log(resp);
                console.log(resp.resultat);
                var io = req.app.get('socketio');
                // var connection = db.getconnection();
                // connection.collection("questions").updateOne(
                //     { _id: id},
                //     {
                //         resultat: 'test'//response.body.resultat
                //     }
                // );
                io.emit('data', {resultat: 'test'});
            }
        });

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

// router.post('/postResponse', function(req, res, next) {
//     console.log(req.body);
//     console.log(req.body.idQuestion);
//     var question = req.body.idQuestion;
//     var resultat = req.body.resultat;
//     var io = req.app.get('socketio');
//     var connection = db.getconnection();
//     connection.collection("questions").find().toArray(function (error, questions) {
//         if (error) throw error;
//         //console.log(questions[req.body.idQuestion].intitule);
//         var nbQuestion = questions.length;
//         if (parseInt(question) < nbQuestion) {
//             connection.collection("questions").updateOne(
//                 {intitule: questions[req.body.idQuestion].intitule},
//                 {
//                     intitule: questions[req.body.idQuestion].intitule,
//                     resultat: req.body.resultat
//                 }
//             );
//             io.emit('data', {resultat: resultat, question: question});
//             res.sendStatus(200);
//
//         } else {
//             res.status(404);
//         }
//     });
// });

router.get('/finishTest', function(req, res, next) {
    console.log('/finishTest');


    res.redirect('/');
});

module.exports = router;