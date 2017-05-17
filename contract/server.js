var express = require('express')
var cors = require('cors');
var app = express()

app.use(cors);

var mongoose = require('mongoose');
mongoose.connect("mongodb://shadofren:shadofren@ds125481.mlab.com:25481/proj1");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var AircraftPartModel = require('./models/AircraftPart');

db.once('open', function() {
    // Schema => Model => Instance
})

app.get('/', function (req, res) {
    AircraftPartModel.find(function (err, results) {
        res.send(results);
    });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})