var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//set up a schema for user model
var userSchema = mongoose.Schema({
	userLogin :{
		email    : { type : String },
		password : { type : String }
	},
	name    	 : { type : String },
	inventory    : [{ type : mongoose.Schema.Types.ObjectId, ref: 'book'}],
	transactions : [{ type : mongoose.Schema.Types.ObjectId, ref: 'transaction'}]

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


