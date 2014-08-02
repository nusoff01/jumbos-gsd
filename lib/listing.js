var Listing = require('../models/listing.js');
var User = require('../models/user.js');
var Book = require('../models/book.js');
var Course = require('../models/course.js');
var mongoose = require('mongoose');


//paramaters: book name, edition, condition, and price
exports.postNewListing = function(req, res){
	console.log(req.body);
	title = req.body.name;
	price = req.body.price;
	ed = req.body.edition;
	cond = req.body.condition;
	user = req.user.userName;

	var l = new Listing();
	l.price = price;
	l.edition = ed;
	l.condition = cond;
	l.seller = user;

	console.log("name: " + title);

	Book.findOne({'name' : title}, function(err, book){
		if(err) return console.log(err);
		if(book){
			l.book = book._id;
			l.save(function(err, l){
				if (err) return console.log(err);
			});
		} else {
			console.log("This book doesn't exist yo");
		}
		res.redirect('/profile');
	});
}


exports.getAllListings = function(req, res){
	var l;
	Listing.find().populate('book').exec(function(err, listings){
		if(err) return console.log(err);
		else{
			res.render('listings.ejs', {listings : listings});
		}
	});
}

exports.getSearch = function(req, res){
	res.render('searchListings.ejs');
}


exports.getNewListing = function(req, res){
	res.render('createListing.ejs', {
		user : req.user // get the user out of session and pass to template
	});
}

//Find listings based on the title of the book

exports.findListingsTitle = function(req, res){
	message = null;
	q = req.query.q;
	console.log("query: " + q);
	if(q){
		Book.findOne({'name' : q}, function(err, book){
			if(err) return console.log(err);
			if(book){
				console.log("book id: " + book._id);
				Listing.find().populate('book').exec(function(err, listings){
					console.log(listings);
					res.render('searchListings.ejs', {
						listings: listings,
						message: message
					});
				});
			}
			else {
				message = "No book found by that title!";
				res.render('searchListings.ejs', {
					message: message,
					listings: null
				});
			}
		});
	} else {
		res.render('searchListings.ejs', {
			message: null,
			listings: null
		});
	}
}

// Find listings based on the course

exports.findListingsCourse = function(req, res){
	message = null;
	dept = req.query.department;
	num  = req.query.number;
	console.log("searching...");

	if(dept && num){
		console.log('about to search');
		Course.findOne({'department' : dept, 'number' : num}).populate('books').exec(function(err, course){
			if(err) 
				console.log(err);
			if(course){
				books = course.books;
				book1 = books[0];
				console.log("BOOK: " + book1);
				Listing.find().populate('book').exec(function(err, listings){
					console.log("listings: " + listings);
					res.render('searchListings.ejs', {
						listings: listings,
						message: message
					});
				});
				console.log(course.books);
			}
			else{
				console.log("nope"); 
			}
		});
	}
	else{
		console.log("no input");
		res.render('searchListings.ejs', {
			message: null,
			listings: null
		});
	}

}

	message = null;