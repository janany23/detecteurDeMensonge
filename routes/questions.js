/**
 * Created by Janany on 23/11/2017.
 */
var express = require('express');
var router = express.Router();
var db = require('./mongo')


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
        res.render('questions', {
            questions: questions
        });
    });
});

/* ADD a question. */
router.post('/add', function(req, res, next) {
    var connection = db.getconnection();
    //console.log(req.body.intitule);
    connection.collection('questions').insert({ "intitule" : req.body.intitule });
    res.redirect('/');
});

module.exports = router;