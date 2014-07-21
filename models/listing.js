var mongoose = require('mongoose');

var listingSchema = mongoose.Schema({
	name       : { type : String},
	price      : { type : Number},
	seller     : { type : String, default : "jim"}
}, {collection:'listings'});

module.exports = mongoose.model('Listing', listingSchema);
