/* models/transaction.js
 * The schema for a transaction. A transaction has a buyer and a listing, 
 * a status (with regards to transaction already completed, etc), a start 
 * time, a time for the buyer and seller to meet, a location for that 
 * meetup, and an array of strings which holds the conversation between
 * buyer and seller
 */

var mongoose = require('mongoose');
var Listing = require('Listing');

var transSchema = mongoose.Schema({
	buyer     : { type : String },
	listing   : { type : mongoose.Schema.Types.ObjectId, ref: 'Listing'},
	status    : { type : String },
	startTime : { type : Date },
	transTime : { type : Date },
	transLoc  : { type : String },
	transConv : [{ type : String }]
});

module.exports = mongoose.model('Transaction', transSchema);

