var Course = require('../models/course.js');
var mongoose = require('mongoose');

exports.postNewCourse = function(req, res){
	console.log(Course);
	var c = new Course();
	c.name = req.body.name;
	c.number = req.body.number;
	c.department = req.body.department;
	console.log(c);
	c.save(function(err, c){
		if (err) return console.log(err);
	});
	res.redirect('/course/new');
}



exports.getNewCourse = function(req, res){
	res.render('createCourse.ejs', {
			user : req.user // get the user out of session and pass to template
		});
}