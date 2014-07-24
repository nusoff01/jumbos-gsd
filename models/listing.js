/* models/listing.js
 * This is the model for a listing. A listing contains a book, a price,
 * and a seller.
 */


var mongoose = require('mongoose');

var listingSchema = mongoose.Schema({
	book       : { type : mongoose.Schema.Types.ObjectId, ref: 'Book'},
	price      : { type : Number},
	seller     : { type : String},
	edition   : { type : Number },
	condition : { type : String }
}, {collection:'listings'});

module.exports = mongoose.model('Listing', listingSchema);
