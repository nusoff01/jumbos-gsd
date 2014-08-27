var Listing = require('../models/listing.js');
var User = require('../models/user.js');
var Book = require('../models/book.js');
var Course = require('../models/course.js');
var mongoose = require('mongoose');
var flash = require('connect-flash');
//var app = require('../app');

var pTitle = "Search for a Book"; 

//function: postNewListing
//desc: creates a listing and saves it when a user fills out and submits a form
//      on the create listing page


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

//TEST PATH DO NOT INCLUDE IN PRODUCTION

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

// function: getSearch
// desc: render the search for a book page

exports.getSearch = function(req, res){
	Book.find( function(err, books){
		titles = populateTitles(books);
		res.render('searchListings.ejs', {
			titles : titles
		});

	})
}

// function: getNewListing
// desc: render the create a new listing page

exports.getNewListing = function(req, res){

	Book.find( function(err, books){
		titles = populateTitles(books);
		res.render('createListing.ejs', {
			user      : req.user, // get the user out of session and pass to template
			pageTitle : "Add a Book",
			message   : req.message,
			titles    : titles
		});
	});
}


/*NECESSARY VARIABLES FOR searchListings.js :
 * user, pageTitle, message, listings
 *
 */
exports.findListings = function(req, res){
	var titles;
	Book.find( function(err, books){
		titles = populateTitles(books);

		res.render('searchListings.ejs', {
			user     : req.user,
			listings : req.listings,
			message  : req.flash('message'),
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

					Listing.find({'book' : book, 'status': 'available'}).populate('book').exec(function(err, listings){
						console.log("listings: " + listings);
						res.render('searchListings.ejs', {
							user     : req.user,
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
				user     : req.user,
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
					Listing.find({'book' : {$in : books}, 'status' : 'available'}).populate('book').exec(function(err, listings){
						res.render('searchListings.ejs', {
							user     : req.user,
							listings : listings,
							message  : message,
							titles   : titles,
							pageTitle: pTitle
						});
					});
				}
				else{
					res.render('searchListings.ejs', {
						user     : req.user,
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

//delete a listing from the profile page

exports.deleteListing = function(req, res){
	//console.log("ID: " + req.body.id);
	Listing.findOne({'_id' : req.body.id}, function(err, listing){
		if(err) console.log(err);
		else {
			console.log(listing);
			listing.status = "pending";
			listing.save();
			req.flash('message', 'Listing deleted');
			//res.redirect('/profile');
			res.send('Listing deleted!');
		}
	})
}


