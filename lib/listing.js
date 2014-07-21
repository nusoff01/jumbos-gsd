var Listing = require('../models/listing.js');
var mongoose = require('mongoose');

exports.postNewListing = function(req, res){
	var l = new Listing();
	l.name = req.name;
	l.save(function(err, l){
		if (err) return console.log(err);
	});

	res.redirect('/profile');
}