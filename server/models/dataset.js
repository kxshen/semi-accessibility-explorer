var mongoose = require('mongoose');

// Create a Mongoose Schema
var Schema = mongoose.Schema;
var Schema = mongoose.Schema;

var JsonSchema = new Schema({
    name: String,
    type: Schema.Types.Mixed
});

// Mongoose model definition
var Json = module.exports = mongoose.model('JString', JsonSchema, 'transit_routes');

// Get StationData
module.exports.getData = function(callback, limit){
	Json.find(callback).limit(limit).sort([['name', 'ascending']]);
}