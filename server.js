var io           = require('socket.io');
var express      = require('express');
var app          = express();
var port         = Number(process.env.PORT || 5000);
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash 	     = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB     = require('./config/database.js');
var listing      = require('./lib/listing.js');

//config

// mongoose.connect(process.env.MONGOLAB_URI ||
//                  process.env.MONGOHQ_URL  ||
//                  'mongodb://localhost/tuftsText');
mongoose.connect(process.env.MONGOLAB_URI);
require('./config/passport')(passport);



//express application setup
app.use(morgan('dev')); //log requests to the console
app.use(cookieParser()); //read cookies
app.use(bodyParser()); //info from html forms

app.set('view engine', 'ejs'); //ejs for templating

app.use(session({ secret: 'whodafuqmitthinktheyare' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//create global variable message
app.set('message', '');

// routes 
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// launch 
app.listen(port);
app.use(express.static(__dirname +  '/public/'));
console.log('Using port ' + port);


