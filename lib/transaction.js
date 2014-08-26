var Transaction = require('../models/transaction.js');
var Listing = require('../models/listing.js');
var Book = require('../models/book.js');
var User = require('../models/user.js');


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
		Listing.findOne({'_id' : req.body.listing}).populate('book').exec(function(err, listing){
			seller = listing.seller;
			User.findOne({'userName' : listing.seller}, function(err, seller){
			//t.listing = listing;
				if(err) console.log(err);
				if(listing){
					t.listing = listing;
					t.save(function(err, t){
						if (err) 
							return console.log(err);
						else{
							message = "transaction saved!";
							user = req.user;
							t.seller = seller.userName;
							t.buyer = user.userName;
							saveSequence(user, seller, listing, t);
							console.log(t);
							return;
							// user = req.user;
							// user.transactions.push(t);
							// seller.transactions.push(t);
							// seller.save();
							// listing.status = "pending";
							// listing.save();
							// user.save(function(err, user){
							// 	if(err) return console.log(err);
							// 	return;
							// });
						}
					});
				} else {
					return console.log('couldnt find listing');
				}
			});
		});
	}
}

function saveSequence(user, seller, listing, t){
	listing.status = "pending";
	user.transactions.push(t);
	console.log("num trans seller: " + seller.transactions.length);
	seller.transactions.push(t);
	console.log("num trans seller: " + seller.transactions.length);
	seller.save(function(err, seller){
		if(err) return console.log("ERROR:" + err);
		listing.save(function(err, listing){
			if(err) return console.log("ERROR:" + err);
			user.save(function(err, user){
				if(err) return console.log("ERROR:" + err);
				return;
			});
		});
	});
}

//TODO - check to make sure transaction is valid before saving

function transCheck(t){
	flag = false;
	if(t.buyer == null) flag = true;
	if(t.status == null) flag = true;
	return true;
}

//update the location and time of a transaction variable
//ALSO adds this as a message to the message array

//TODO: error checking: all fields are filled, time is after current time.

exports.addLocTime = function(req, res){
	 
	 Transaction.findById(req.body.trans, function(err, t){
	//console.log("request: " + req.user)
		var conVar = new Object();
		conVar.mSender = req.user.userName;
		var message = "!!!!! Meetup requested by " + conVar.mSender + ": ";

		//TEMPORARY should be new Date() then add each value individually
		t.transTime = req.body.day;
		t.transLoc = req.body.location;
		time = req.body.time
		//t.transTime.setHours(time.getHours());
		//t.transTime.setMinutes(time.getMinutes());


		var dateString = "" + time + " " + (t.transTime.getUTCMonth() + 1) + "/" + t.transTime.getUTCDate();

		message += dateString + " at " + t.transLoc + " !!!!!";
		conVar.mContent = message;
		conVar.mTime = new Date();
		conVar.mType = "meetupM";
		t.transConv.push(conVar);


		//ADD BUTTONS FOR RESPONSE

		t.save(function(err, t){
			if(err) return err;
			res.redirect('/profile');
		});
	})
}




//checking for errors when a user 
addLTcheck = function(req){
	returnMes = "OK";

	var day = req.body.day;
	var loc = req.body.location;
	// var hour = req.body.hour;
	// var minute = req.body.minute;
	// var am = req.body.am;

	if(!day || !loc){ //TODO add in hour/minute
		returnMes = "missing component!";
	}

	// day.setMinutes(minute);
	// actualHours = addHours(hour, am);
	// day.setHours(actualHours);
	
	
	
	return "OK";
}

//adding hours if PM
addHours = function(hours, am){
	if(am == "pm"){
		return (hours + 12); 
	}
	return hours;
}

//subtracting hours if PM
subHours = function(hours, am){
	if(am == "pm"){
		return hours - 12; 
	}
	if(hours == 0){
		return 12;
	}
	return hours;
}

//LOGIC FOR ADDING A MEETUP
//IF no meetup
//		either can add
//IF suggestion from A
//		B can accept/reject
//		neither can add
//		IF B accepts
//			neither can add
//		IF B reject 
//			either can add



//add a message from a user to the transaction page
exports.addMessage = function(req, res){
	res.setHeader("Content-Type", "text/html");
	body = JSON.stringify(req.body);
	console.log(req.body.transID);
	Transaction.findById(req.body.transID, function(err, t){
		if(err) console.log(err);
		console.log("trans: " + t)
		if(err) return err;
		var conVar = new Object();
		var message = req.body.content;
		conVar.mSender = req.user.userName;
		conVar.mContent = conVar.mSender + ": " + message;
		conVar.mTime = new Date();
		conVar.mType = "userM";
		//console.log("transaction: " + t);
		//console.log("buyer: " + t.buyer);
		t.transConv.push(conVar);
		t.save(function(err, t){
			if(err) return err;

			receiver = findAlertR(t.buyer, t.seller, req.user.userName);
			User.findOne({userName : receiver}, function(err, u){
				if(err) return err;
				var alert = new Object();
				alert.type = "mesAlert";
				alert.message = "" + req.user.userName + " sent you a message!";
				alert.link = "/profile";
				u.alerts.push(alert);
				u.save(function(err, u){
					if(err) return err;
					res.send(conVar.mContent);
				})
			});
		});
	})
}


//find whether buyer or seller is the receipt of the alert
findAlertR = function(buyer, seller, user){
	console.log("Buyer: " + buyer);
	console.log("Seller: " + seller);
	if(buyer == user) return seller;
	return buyer;
}

createMAlert = function(receiver){

}



//username, sender, transactionID


exports.acceptSug = function(req, res){
	// Transaction.findById(req.body.trans, function(err, t){
	// 	if(err) return err;
	// 	var conVar = new Object();
	// 	var message = "Meet up finalized!";
	// 	conVar.mSender = req.user.userName;
	// 	conVar.mContent = message;
	// 	conVar.mTime = newDate();
	// 	conVar.mType = "meetupM";
	// 	t.transConv.push(conVar);
	// 	t.save(function(err, t){
	// 		if(err) return err;
	// 		res.send('#BARS');
	// 	});
	// });
	console.log('body: ' + JSON.stringify(req.body));
	res.send("#BARS");
}

