/**
 * Created by Janany on 23/11/2017.
 */
var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var db = require('./mongo');


/* GET questions listing. */
router.get('/', function(req, res, next) {
    var connection = db.getconnection();
    connection.collection("questions").find().toArray(function (error, questions) {
        if (error) throw error;

        //questions.forEach(function(obj, i) {
        //    console.log(
        //        "ID : "  + obj._id.toString() + "\n"
        //        + "Question "+(i+1)+" : " + obj.intitule + "\n"
        //    );
        //});
        res.render('questions', {
            title: 'Questions',
            questions: questions
        });
    });
});

/* ADD a question. */
router.post('/add', function(req, res, next) {
    var connection = db.getconnection();
    //console.log(req.body.intitule);
    connection.collection('questions').insert({ "intitule" : req.body.intitule, 'resultat':'', 'reponse':'' });
    res.redirect('/test/');
});

/* DELETE a question. */
router.post('/delete', function(req, res, next) {
    var connection = db.getconnection();
    console.log(req.body.id);
    connection.collection('questions').deleteOne({ "_id" : ObjectId(req.body.id) });
    res.redirect('/test/');
});


module.exports = router;