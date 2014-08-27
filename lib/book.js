var Book = require('../models/book.js');
var Course = require('../models/course.js');
var mongoose = require('mongoose');



// function - postNewBook
// occurs when a user fills out the new book form and submits it

exports.postNewBook = function(req, res){
	var b = new Book();

	b.name = req.body.name;

	var num = req.body.number;
	var dept = req.body.department;

	Course.findOne({'department': dept, 'number': num}, function(err, course){
		if(course){
			console.log("COURSE: " + course);
			b.course = course;
			console.log(b);
			b.save(function(err, b){
				if(err) return console.log(err);
				course.books.push(b);
				course.save();
				resMessage = "Book saved to course " + dept + " " + num;
				res.redirect('/book/new');
			});
		}
		else{
			return console.log("course doesn't exist");
		}
	});

}

exports.getNewBook = function(req, res){
	res.render('createBook.ejs');
}
