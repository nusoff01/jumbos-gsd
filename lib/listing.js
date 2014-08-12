var Listing = require('../models/listing.js');
var User = require('../models/user.js');
var Book = require('../models/book.js');
var Course = require('../models/course.js');
var mongoose = require('mongoose');
var flash = require('connect-flash');
//var app = require('../app');

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
	l.status = "available";

	Book.findOne({'name' : title}, function(err, book){
		if(err) return console.log(err);
		if(book){
			l.book = book._id;
			l.save(function(err, l){
				if (err) 
					return console.log(err);
				else{
					req.flash('message', 'Listing saved!');
					console.log('right before error?');
					return res.redirect('/profile');
				}
			});
		} 

		else {
			message = "no book found by that name! Add it to our database: ";
			message.link.exists = true;
			message.link.path = "/book/new";
			message.link.text = "[add book]";			
			res.render('createListing.ejs', {
				user      : req.user, // get the user out of session and pass to template
				pageTitle : pTitle,
				message   : message		
			});
		}
	});
}


//error checking for the postNewListing method
pNL = function(l){
	var validity;
	validity.message = "Thanks for adding a listing!"
	validity.good = true;
	if(l.price < 1){
		validity.message = "Invalid price!";
		validity.good = false;
	}
	if(l.edition < 1){
		validity.message = "Invalid Edition!";
		validity.good = false;
	}
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
		pageTitle : "Add a Book",
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

					Listing.find({'book' : book}).populate('book').exec(function(err, listings){
						console.log("listings: " + listings);
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
					Listing.find({'book' : {$in : books}}).populate('book').exec(function(err, listings){
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
						message  : "No book found for this course",
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


