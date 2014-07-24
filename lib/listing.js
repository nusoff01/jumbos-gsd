var Listing = require('../models/listing.js');
var User = require('../models/user.js');
var Book = require('../models/book.js');
var mongoose = require('mongoose');


//paramaters: book name, edition, condition, and price
exports.postNewListing = function(req, res){
	var l = new Listing();
	var b = new Book();
	b.name = req.body.name;
	b.condition = req.body.condition;
	b.edition = req.body.edition;
	l.price = req.body.price;
	l.seller = req.user.userLogin.email;
	l.book = b;
	console.log(l);
	l.save(function(err, l){
		if (err) return console.log(err);
		else {
			console.log("user id: " + req.user._id);
			User.update({_id:req.user._id},{ $push: { 'inventory': l._id }},
				function(err, data){
					if(err) return console.log(err);
				});
		}
	});
	res.redirect('/profile');
}

exports.getAllListings = function(req, res){
	var l;
	Listing.find(function(err, listings){
		if(err) return console.log(err);
		l = listings;
		res.render('listings.ejs', {listings : listings});
	});
}

exports.getNewListing = function(req, res){
	res.render('createListing.ejs', {
			user : req.user // get the user out of session and pass to template
		});
}