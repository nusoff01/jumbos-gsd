var Book = require('../models/book.js');
var mongoose = require('mongoose');

exports.postNewBook = function(req, res){
	var b = new Book();
	b.name = req.body.name;
	b.course = req.body.course;
	console.log(b);
	b.save(function(err, b){
		if (err) return console.log(err);
	});
	res.redirect('/');
}

exports.getNewBook = function(req, res){
	res.render('createBook.ejs');
}
