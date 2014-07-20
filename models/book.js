var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
	name      : { type : String },
	edition   : { type : String },
	price     : { type : Number },
	course    : { type : String}   //needs to be changed to model
});

exports.book = mongoose.model('transaction', bookSchema);

