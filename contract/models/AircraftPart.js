var mongoose = require('mongoose');

var aircraftPartSchema = new mongoose.Schema({
    name: String,
    serial: Number,
    price: Number,
    description: String
});

module.exports = mongoose.model('AircraftPart', aircraftPartSchema);