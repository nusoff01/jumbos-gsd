var mongoose = require('mongoose');

var courseSchema = mongoose.Schema({
	name       : { type : String},
	number     : { type : Number},
	department : { type : String},
	//books      : { type : object.book}
});

exports.course = mongoose.model('course', courseSchema);

