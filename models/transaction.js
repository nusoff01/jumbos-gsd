/* models/transaction.js
 * The schema for a transaction. A transaction has a buyer and a listing, 
 * a status (with regards to transaction already completed, etc), and a start 
 * time.
 */

var mongoose = require('mongoose');

var transSchema = mongoose.Schema({
	buyer     : { type : String },
	listing   : { type : mongoose.Schema.Types.ObjectId, ref: 'Listing'},
	status    : { type : String },
	startTime : { type : Date }
});

module.exports = mongoose.model('Transaction', transSchema);

