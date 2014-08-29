// app/routes.js
module.exports = function(app, passport) {
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	// process the login form
	// app.post('/login', do all our passport stuff here);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash    : true
	}));

	//process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/',
		failureFlash    : true
	}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	var user = require('./lib/user.js');

	app.get('/profile', isLoggedIn, user.renderProfile);

	app.post('/user/deleteAlert', isLoggedIn, user.deleteAlert);

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	//create a new listing
	var listing = require('./lib/listing.js');
	
	app.get('/listing/list', isLoggedIn, listing.getAllListings);

	app.post('/listing/new', isLoggedIn, listing.postNewListing);
	app.get('/listing/new', isLoggedIn, listing.getNewListing);

	//query listings by title
	//app.get('/listing/title/:q', listing.findListings);

	app.post('/listing/delete', listing.deleteListing);


	app.get('/listing/search', listing.findListings);
	app.get('/listing/search/title', listing.findListingsTitle);
	app.get('/listing/search/course', listing.findListingsCourse);

//Book procceses
	var book = require('./lib/book.js');
	app.post('/book/new', book.postNewBook);
	app.get('/book/new', book.getNewBook);

//course processes
	var course = require('./lib/course.js'); 
	app.post('/course/new', course.postNewCourse);
	app.get('/course/new', course.getNewCourse);

//transaction processes
	var transaction = require('./lib/transaction.js');
	app.post('/transaction/postT', transaction.postTrans);
	app.post('/transaction/addLT', transaction.addLocTime);
	app.post('/transaction/addM',  transaction.addMessage);

	app.post('/transaction/acceptLT', transaction.acceptSug);
	// app.post('/transaction/rejectLT', transaction.rejectSug);

	app.post('/courses/addCourses', course.postCourses);
	app.get('/courses/addCourses', course.getCourses);
		




//settings routes
	// app.get('/settings', isLoggedIn, user.renderSettings);
	// app.post('/settings/set', user.updateSettings);


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/404');
}