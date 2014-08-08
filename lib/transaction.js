var Transaction = require('../models/transaction.js');
var Listing = require('../models/listing.js');
var Book = require('../models/book.js');


//Add a new transaction to the database
//Note: creating a transaction is done by the user clicking "buy", 
//   therefore req.user refers to the buyer
exports.postTrans = function(req, res){
	var t = new Transaction();
	t.buyer = req.user.userName;
	//t.listing = req.listing;
	t.status = "pending";
	t.startTime = new Date();


	console.log("request id: " + req.body.listing);

	if(transCheck(t)){
		//console.log("REQUEST: " + req.body);
		Listing.findOne({'_id' : req.body.listing}).populate('book').exec(function(err, listing){
			//t.listing = listing;
			if(err) console.log(err);
			if(listing){
				t.listing = listing;
				console.log(listing);
				t.save(function(err, t){
					if (err) 
						return console.log(err);
					else{
						message = "transaction saved!";
						user = req.user;
						user.transactions.push(t);
						user.save(function(err, user){
							if(err) return console.log(err);
							return;
						});
					}
				});
			} else {
				return console.log('couldnt find listing');
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

exports.renderTrans = function(req, res){


}