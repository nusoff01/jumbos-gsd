var Book = require('../models/book.js');
var Course = require('../models/course.js');
var mongoose = require('mongoose');



// function - postNewBook
// occurs when a user fills out the new book form and submits it

exports.postNewBook = function(req, res){
	
	name = req.body.name;
	if(!name){
		resMes = "Please enter a book name!";
		res.render('createBook.ejs', {message: resMes});
	}
	
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
}

exports.getNewBook = function(req, res){
	res.render('createBook.ejs');
}

exports.findCourses = function(req, res){
	console.log("reached backend");
	//title = body.title;
	console.log(req.body);
	title = req.body.title;
	Book.findOne({'name' : title}).populate('courses').exec(function(err, b) {
		if(err) console.log(err);
		c = b.courses;

		resString = "";
		for(i = 0; i < c.length; i++){
			resString += c[i].department + " " + c[i].number;
			if(i != c.length - 1){
				resString += ", ";
			}
		}
		console.log(resString);
		res.send(resString);
	});
}

//add courses to an existing book

exports.addCourses = function(req, res, b, titles){

	//find out number of courses
	numCourseAdd = 1;
	cDept = "department" + numCourseAdd;
	cNum = "number" + numCourseAdd;
	while(req.body[cDept]){
		numCourseAdd++;
		cDept = "department" + numCourseAdd;
	}

	var numRunningQ = 0;
	if(numCourseAdd > 1){
		for(var i = 1; i < numCourseAdd; i++){
			
			cNum = "number" + i;
			cDept = "department" + i;
			
			num = req.body[cNum];
			dept = req.body[cDept].toUpperCase();
			
			++numRunningQ;
			
			Course.findOne({'department': dept, 'number': num}, function (err, c){
				if(err) {console.log(err)} else {console.log('go daddy')};
				console.log(c);
				if(!c){
					errorM = "" + dept + " " + num + " does not exist!";
					res.render('createListing.ejs', {
						titles    : titles,
						user      : req.user,
						pageTitle : pTitle,
						message   : errorM
					});
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
								errorM = "" + dept + " " + num + " does not exist!";
								res.render('createListing.ejs', {
									titles    : titles,
									user      : req.user,
									pageTitle : pTitle,
									message   : "Listing saved!"
								});
							});
						}	
					});
				}
			});
		}
	} else {
		res.render('createListing.ejs', {
			titles    : titles,
			user      : req.user,
			pageTitle : pTitle,
			message   : "Listing saved!"
		});
	}	

}
