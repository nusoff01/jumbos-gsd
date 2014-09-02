var Book = require('../models/book.js');
var Course = require('../models/course.js');
var mongoose = require('mongoose');



// function - postNewBook
// occurs when a user fills out the new book form and submits it

exports.postNewBook = function(req, res){
	
	name = req.body.name;

	
	Book.findOne({'name' : name}, function(err, book){
		if(err) console.log(err);
		if(book){
			resMes = "That book already exists!";
			res.render('createBook.ejs', {message: resMes});
		} 
		var b = new Book();
		b.name = name;

		var execCond = true;

		//find out number of courses
		numCourseAdd = 1;
		cDept = "department" + numCourseAdd;
		cNum = "number" + numCourseAdd;
		while(req.body[cDept]){
			numCourseAdd++;
			cDept = "department" + numCourseAdd;
		}

		var numRunningQ = 0;
		for(var i = 1; i < numCourseAdd; i++){
			
				cNum = "number" + i;
				cDept = "department" + i;
				
				num = req.body[cNum];
				dept = req.body[cDept].toUpperCase();

				console.log("course " + numCourseAdd + ": ");
				console.log(num);
				console.log(dept);
				
				++numRunningQ;
				
				Course.findOne({'department': dept, 'number': num}, function (err, c){
					if(err) {console.log(err)} else {console.log('go daddy')};
					console.log(c);
					if(!c){
						
						resMes = "" + dept + " " + num + " does not exist!";
						res.render('createBook.ejs', {message: resMes});
					} else {
						
						
						c.books.push(b);
						b.courses.push(c);
						console.log("book (should be first): " + b);
						c.save(function(err, c){
							if(err) console.log(err);
							console.log("saving");
							--numRunningQ;
							if(numRunningQ === 0){
								b.save(function(err, b){
									console.log("book: " + b);
									if(err) console.log(err);
									res.render('createBook.ejs', {message: "Book saved!"});
								});
							}
							
						});
					}
				});
			
		}
	});
	
	


	// var num = req.body.number;
	// var dept = req.body.department;
	// Book.findOne({'name' : b.name}, function(err, book){
	// 	if(err) console.log(err);
	// 	if(book){
	// 		resMessage = "That book already exists!";
	// 		res.render('createBook.ejs', {message: resMessage});
	// 	}
	// 	Course.findOne({'department': dept, 'number': num}, function(err, course){
	// 		if(course){
	// 			b.course = course;
	// 			console.log(b);
	// 			b.save(function(err, b){
	// 				if(err) return console.log(err);
	// 				course.books.push(b);
	// 				course.save();
	// 				resMessage = "Book saved to course " + dept + " " + num;
	// 				res.render('createBook.ejs', {message: resMessage});
	// 			});
	// 		}
	// 		else{
	// 			resMessage = "not a valid course!"
	// 			res.render('createBook.ejs', {message : resMessage})
	// 		}
			
	// 	});
	// });
}

exports.getNewBook = function(req, res){
	res.render('createBook.ejs');
}
