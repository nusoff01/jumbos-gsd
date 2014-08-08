var Transaction = require('../models/transaction.js');
var Listing = require('../models/listing.js');
var Book = require('../models/book.js');


//Add a new transaction to the database
//Note: creating a transaction is done by the user clicking "buy", 
//   therefore req.user refers to the buyer
exports.postTrans = function(req, res){
	var t = new Transaction();
	t.buyer = req.user.userName;
	t.listing = req.listing;
	t.status = "pending";
	t.startTime = new Date();
	console.log(t.startTime);

	if(transCheck(t)){
		t.save(function(err, t){
			if (err) 
				return console.log(err);
			else{
				message = "transaction saved!";
			}
		});
	}
}

//TODO - check to make sure transaction is valid before saving

function transCheck(t){
	flag = false;
	if(t.buyer == null) flag = true;
	if(t.status == null) flag = true;
	return true;
}

//Render a transaction page

exports.renderTransaction = function(req, res){

}