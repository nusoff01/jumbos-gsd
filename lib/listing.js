var Listing = require('../models/listing.js');
var mongoose = require('mongoose');

exports.postNewListing = function(req, res){
	var l = new Listing();
	console.log("PRRRRIIIICE: " + req.price);
	l.name = req.body.name;
	l.price = req.body.price;
	l.seller = req.params.seller;
	console.log(l);
	l.save(function(err, l){
		if (err) return console.log(err);
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