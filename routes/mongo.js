/**
 * Created by Janany on 23/11/2017.
 */
/* Mongo.js*/

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/yourdatabasename";
var assert = require('assert');

var connection=[];
// Create the database connection
establishConnection = function(callback){
    MongoClient.connect("mongodb://localhost/detecteurMensonge", { poolSize: 10 },function(err, db) {
        assert.equal(null, err);

        connection = db
        if(typeof callback === 'function' && callback())
            callback(connection)

    });



}

function getconnection(){
    return connection
}

module.exports = {
    establishConnection:establishConnection,
    getconnection:getconnection
}