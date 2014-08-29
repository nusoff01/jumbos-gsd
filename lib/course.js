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



exports.hardSave = function(req, res){
	var cDep = "AFR";
	var nums = [22, 88, 92, 147, 160];
	for(i = 0; i < nums.length; i++){
		var c = new Course()
		c.number = nums[i];
		c.department = cDep;
		c.save(function(err, c){
			console.log("saved " + c.department + " " + c.number);
		})
	}
}

exports.postCourses = function(req, res){
	var cDep = req.body.cDep;
	var inp = req.body.inp;
	var nums = inp.split(" ");
	console.log(nums);
	for(i = 0; i < nums.length; i++){
		var c = new Course()
		num = Number(nums[i]);
		c.department = cDep;
		if(num){
			c.number = num;
			c.save(function(err, c){
				console.log("saved " + c.department + " " + c.number);
			})
		}
	}
	res.render("addCourses.ejs");
}

exports.getCourses = function(req, res){
	res.render("addCourses.ejs");
}