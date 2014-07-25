/* models/book.js
 * The schema for a book. A book is has a name (title), an edition, a 
 * condition, and a course that it is associated with.
 */

var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
	name      : { type : String },
	course    : { type : mongoose.Schema.Types.ObjectId, ref: 'course'}
});
module.exports = mongoose.model('Book', bookSchema);

