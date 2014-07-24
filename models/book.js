/* book.js
 * The schema for a book. A book is has a name (title), an edition, a 
 * condition, and a course that it is associated with.
 */

var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
	name      : { type : String },
	edition   : { type : Number },
	condition : { type : String },
	course    : { type : mongoose.Schema.Types.ObjectId, ref: 'course'}
});
exports.book = mongoose.model('book', bookSchema);

