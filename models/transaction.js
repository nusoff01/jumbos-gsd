var mongoose = require('mongoose');

var transSchema = mongoose.Schema({
	buyer     : { type : String },
	seller    : { type : String },
	book      : { type : String },
	status    : { type : String },
	startTime : { type : Date }
});

exports.transaction = mongoose.model('transaction', transSchema);

