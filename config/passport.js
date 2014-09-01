//load everything
var LocalStrategy = require('passport-local').Strategy;

//load user model
var User = require('../models/user');

//expose function to the app
module.exports = function(passport) {
	//serialize and unserialize users per each session
	passport.serializeUser(function(user, done){
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	//signup
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		var userName = req.body.userName;
		//User.findOne only fires if data is sent back
		process.nextTick(function(){
			//check to see if the user exists
			User.findOne({'userLogin.email' : email}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'Account allready exists for that email address'));
				} else {
					User.findOne({'userName' : userName}, function(err, user){
						if(err)
							return done(err);
						if(user){
							return done(null, false, req.flash('signupMessage', 'Account allready exists for that user name'));
						}
						else{
							var newUser = new User();
							newUser.userLogin.email = email;
							newUser.userLogin.password = newUser.generateHash(password);
							newUser.userName = userName;
							//console.log("uername: " + req.body.userName);
							newUser.save(function(err){
								if(err)
									throw err;

								return done(null, newUser);
							});
						}
					});
				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
    	
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'userLogin.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });
    }));
};

