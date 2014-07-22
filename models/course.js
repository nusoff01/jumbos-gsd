var mongoose = require('mongoose');

var courseSchema = mongoose.Schema({
	name       : { type : String},
	number     : { type : Number},
	department : { type : String},
	//books      : { type : object.book}
}, {collection:'courses'});

module.exports = mongoose.model('Course', courseSchema);

