var Course = require('../models/course.js');
var mongoose = require('mongoose');

// function: postNewCourse
// desc: occurs when a user fills out and submits a new course form

exports.postNewCourse = function(req, res){
	var c = new Course();
	c.name = req.body.name;
	c.number = req.body.number;
	c.department = req.body.department;
	c.save(function(err, c){
		if (err) return console.log(err);
		resMessage = "Course saved!";
		res.redirect('/course/new');
	});
}


// function: getNewCourse
// desc: renders the create course page

exports.getNewCourse = function(req, res){
	res.render('createCourse.ejs', {
		user : req.user // get the user out of session and pass to template
	});
}