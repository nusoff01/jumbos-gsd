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
	info = req.body.extraInfo;
	user = req.user.userName;
	addDate = new Date();
	var dateString = "" + (addDate.getUTCMonth() + 1) + "/" + addDate.getUTCDate();

	var l = new Listing();
	l.price = price;
	l.edition = ed;
	l.condition = cond;
	l.seller = user;
	l.status = "available";
	l.datePosted = dateString;
	l.moreInfo = info;

	errorM = pNL(l);
	console.log("Listing: " + l);
	Book.findOne({'name' : title}, function(err, book){

		if(err) return console.log(err);
		if(book){
			if(errorM == ""){
				
				l.book = book._id;
				l.save(function(err, l){
					if (err) 
						return console.log(err);
					else{
						Book.find( function(err, books){
							titles = populateTitles(books);
							addCourses(req, res, book, titles);
						});
						// req.flash('message', 'Listing saved!');
						// console.log(l);
						// return res.redirect('/profile');
					}
				});
			} else {
				Book.find( function(err, books){
					titles = populateTitles(books);
					res.render('createListing.ejs', {
						titles : titles,
						user      : req.user,
						pageTitle : pTitle,
						message   : errorM
					});
				});
			}
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
	var message = "";
	if(!l.price){
		message += " No price! ";
	}
	else if(l.price < 1 || l.price > 999){
		message += " Invalid price! ";
	}
	if(l.edition && l.edition < 1){
		message += " Invalid Edition! ";
	}
	if(l.moreInfo && l.moreInfo.length > 100){
		message += " Info message too long! ";
	}
	return message;
}




//add courses to an existing book

addCourses = function(req, res, b, titles){
	console.log("Request body: " + JSON.stringify(req.body));
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

	});
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
 * user, pageTitle, message, listings, titles
 * results - a flag that specifies whether the page load 
 *           comes from a search
 */
exports.findListings = function(req, res){
	var titles;
	Book.find( function(err, books){
		Listing.find({'status': 'available'}).populate('book').exec(function(err, listings){
			console.log(listings)
			titles = populateTitles(books);
			listings.sort(function(a, b) { 
				//console.log(a.book.name);
			    return a.price - b.price;
			})


			function compare(a,b) {
			    if (a.book.name < b.book.name)
			       return -1;
			    if (a.book.name> b.book.name)
			      return 1;
			    return 0;
			}

			listings.sort(compare);

			for(var i in listings)
			    console.log(listings[i].book.name) 
			res.render('searchListings.ejs', {
				user     : req.user,
				listings : listings,
				message  : req.flash('message'),
				titles   : titles,
				pageTitle: pTitle,
				results  : false       
			});
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
						if(err) return console.log(err);
						console.log("listings: " + listings);
						res.render('searchListings.ejs', {
							user     : req.user,
							listings : listings,
							message  : message,
							pageTitle: pTitle,
							results  : true
						});
					});
				}
				else {
					res.render('searchListings.ejs', {
						message  : "No books found!",
						listings : null,
						results  : true,
						pageTitle: pTitle
					});
				}
			});
		} else {
			res.render('searchListings.ejs', {
				user     : req.user,
				message  : null,
				listings : null,
				results  : false,
				pageTitle: pTitle
			});
		}
	});
}

// Find listings based on the course

exports.findListingsCourse = function(req, res){
	message = null;
	if(req.query.department){
		dept = req.query.department.toUpperCase();
	} else {
		dept = req.query.department;
	}
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
							pageTitle: pTitle,
							results  : true
						});
					});
				}
				else{
					res.render('searchListings.ejs', {
						user     : req.user,
						listings : null,
						message  : "No books found for this course",
						titles   : titles,
						pageTitle: pTitle,
						results  : true
					}); 
				}
			}); 
		} 
		else{
			res.render('searchListings.ejs', {
				message  : null,
				listings : null,
				titles   : titles,
				pageTitle: pTitle,
				results  : false
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


