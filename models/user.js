/* models/user.js
 * 
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


//set up a schema for user model
var userSchema = mongoose.Schema({
	userLogin :{
		email    : { type : String },
		password : { type : String }
	},
	userName     : { type : String },
	inventory    : [{ type : mongoose.Schema.Types.ObjectId, ref: 'Listing'}],
	transactions : [{ type : mongoose.Schema.Types.ObjectId, ref: 'Transaction'}],
	alerts       : [{
		type     : { type : String },  //sysAlert, mesAlert, buyAlert, comAlert, canAlert
		message  : { type : String },
		link     : { type : String },  //"no link" if none
		active   : { type : Boolean}   //If it should be displayec to user, true.
	}]

});

//hash generation
userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);	
};

//check if the password is valid
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.userLogin.password);
};

//expose the model to the app
module.exports = mongoose.model('User', userSchema);


