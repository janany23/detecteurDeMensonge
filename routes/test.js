/**
 * Created by Janany on 23/11/2017.
 */
var express = require('express');
var router = express.Router();
var db = require('./mongo')
var exec = require('child_process').exec;
var ObjectId = require('mongodb').ObjectID;


/* GET questions listing. */
router.get('/', function(req, res, next) {
    var connection = db.getconnection();
    connection.collection("questions").find().toArray(function (error, questions) {
        if (error) throw error;

        questions.forEach(function(obj, i) {
            console.log(
                "ID : "  + obj._id.toString() + "\n"
                + "Question "+(i+1)+" : " + obj.intitule + "\n"
            );
        });
        res.render('test', {
            questions: questions
        });
    });
});

/* ADD a question. */
router.get('/playQuestion', function(req, res, next) {
    var connection = db.getconnection();

   // console.log(req.query.questionId);
    var id = req.query.questionId;
   // console.log("id : "+id);
    //var question = connection.questions.findOne({ "_id" : new ObjectId(req.body.questionId)});
    connection.collection("questions").find({ "_id" : ObjectId(id) }).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        var yourscript = exec('sh dit.sh '+ result.intitule);
        //         , (error, stdout, stderr) => {
        //         console.log(`${stdout}`);
        // console.log(`${stderr}`);
        // if (error !== null) {
        //     console.log(`exec error: ${error}`);
        // }
        res.redirect('/');
    });
        //questions.forEach(function(obj, i) {
        //    console.log(
        //        "ID : "  + obj._id.toString() + "\n"
        //        + "Question "+(i+1)+" : " + obj.intitule + "\n"
        //    );
        //});

    //});

    //console.log(question);
    //res.redirect('/');
});

router.post('/postResponse', function(req, res, next) {
    console.log('on passe dans le post');
    console.log(req.body);
    console.log(req.query);
    res.sendStatus(200);
    //res.end(200);
});

module.exports = router;