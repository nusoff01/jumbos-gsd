var mongoose = require('mongoose');

var listingSchema = mongoose.Schema({
	name       : { type : String},
	price      : { type : Number},
	seller     : { type : String}
});

exports.listing = mongoose.model('listing', listingSchema);