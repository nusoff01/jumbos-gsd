var Listing = require('../models/listing.js');
var User = require('../models/user.js');
var Book = require('../models/book.js');
var Course = require('../models/course.js');
var mongoose = require('mongoose');
var pTitle = "Search for a Book"; 


//paramaters: book name, edition, condition, and price
exports.postNewListing = function(req, res){

	var message = null;
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

	Book.findOne({'name' : title}, function(err, book){
		if(err) return console.log(err);
		if(book){
			l.book = book._id;
			l.save(function(err, l){
				if (err) 
					return console.log(err);
				else{
					message = "listing saved!";
				}
			});
		} else {
			var message = 
		}
		res.redirect('/profile');
	});
}


exports.getAllListings = function(req, res){
	var l;
	Listing.find().populate('book').exec(function(err, listings){
		if(err) return console.log(err);
		else{
			res.render('listings.ejs', {
				listings : listings,
				pageTitle: pTitle
			});
		}
	});
}

exports.getSearch = function(req, res){
	res.render('searchListings.ejs');
}


exports.getNewListing = function(req, res){
	res.render('createListing.ejs', {
		user      : req.user, // get the user out of session and pass to template
		pageTitle : pTitle,
		message   : req.message
	});
}

//display the page for searching for a book

exports.findListings = function(req, res){
	message = req.message //the message passed in by one of the search functions
	var titles;
	Book.find( function(err, books){
		titles = populateTitles(books);

		res.render('searchListings.ejs', {
			listings : req.listings,
			message  : message,
			titles   : titles,
			pageTitle: pTitle 
		});


	});

	console.log("titles: " + titles);

}


//Find listings based on the title of the book

exports.findListingsTitle = function(req, res){
	message = null;
	q = req.query.q;
	Book.find(function(err, books){

		titles = populateTitles(books);

		if(q){
			Book.findOne({'name' : q}, function(err, book){
				if(err) return console.log(err);
				if(book){

					Listing.find().populate('book').exec(function(err, listings){
						res.render('searchListings.ejs', {
							listings : listings,
							message  : message,
							pageTitle: pTitle 
						});
					});
				}
				else {
					res.render('searchListings.ejs', {
						message  : "No books found!",
						listings : null,
						pageTitle: pTitle
					});
				}
			});
		} else {
			res.render('searchListings.ejs', {
				message  : null,
				listings : null,
				pageTitle: pTitle
			});
		}

	});
}

// Find listings based on the course

exports.findListingsCourse = function(req, res){
	message = null;
	dept = req.query.department;
	num  = req.query.number;
	Book.find(function(err, books){

		titles = populateTitles(books);

		if(dept && num){
			Course.findOne({'department' : dept, 'number' : num}).populate('books').exec(function(err, course){
				if(err) 
					console.log(err);
				if(course){
					books = course.books;
					Listing.find().populate('book').exec(function(err, listings){
						res.render('searchListings.ejs', {
							listings : listings,
							message  : message,
							titles   : titles,
							pageTitle: pTitle
						});
					});
				}
				else{
					res.render('searchListings.ejs', {
						listings : null,
						message  : "no book found!",
						titles   : titles,
						pageTitle: pTitle
					}); 
				}
			}); 
		} 
		else{
			res.render('searchListings.ejs', {
				message  : null,
				listings : null,
				titles   : titles,
				pageTitle: pTitle
			});
		}
	});
}

//helper function to get all titles from books to fill the 
//autocomplete array
populateTitles = function(books){
	titles = [];
	books.forEach(function(book){
		titles.push( book.name );
	});
	return titles;
}


