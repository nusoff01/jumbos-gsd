var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
	name      : { type : String },
	edition   : { type : String },
	course    : { type : String}   //needs to be changed to model
});

exports.book = mongoose.model('book', bookSchema);

