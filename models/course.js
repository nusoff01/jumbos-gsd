/* models/course.js
 * A course has a name, a number, a department, and a collection of books
 * which are associated with that course.
 */
var mongoose = require('mongoose');

var courseSchema = mongoose.Schema({
	name       : { type : String},
	number     : { type : Number},
	department : { type : String},
	books      : [{ type : mongoose.Schema.Types.ObjectId, ref: 'Book'}]
}, {collection:'courses'});

module.exports = mongoose.model('Course', courseSchema);

