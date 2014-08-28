var User = require('../models/user.js');
var Listing = require('../models/listing.js');
var Book = require('../models/book.js');
var Transaction = require('../models/transaction.js');


/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.renderProfile = function(req, res){
  User.findOne({_id:req.user._id}).populate('inventory').populate('transactions').exec(function(err, u) {
    uName = req.user.userName;
    
    Listing.find({ $and: [{seller: uName}, {status : 'available'}]}).populate('book').exec(function(err, inventory){
      u.inventory = inventory;

      //Transaction.find({ $or: [{seller: uName}, {buyer: uName}]}).populate('listing').exec(function(err, t){ 
      Transaction.populate(u, {path: 'transactions.listing', model: 'Listing'}, function(err, u){
        Listing.populate(u, {path: 'transactions.listing.book', model: 'Book'}, function(err, u){ //.exec(function(err, listings){

          //u.transactions = t 
         // console.log('Made a difference?' + t == to);
          if (!u || err) {
            console.log(err);
            res.send(404);
          } else {
            //console.log(u);
            message = req.flash('message');
            console.log("message: " + message);
            res.render('profile.ejs', {user: u, message: message});
          }
        });
      });
    });
  });
};

renderTrans = function(user){
  Transaction.find({buyer: user.userName}).populate('listing').exec(function(err, t){
    if (err) console.log(err);
    user.transactions = t;
    return user;
  });
}

exports.addSysAlert = function(req, res){
  alert = "no alert";
}

// function: deleteAlert
// desc: deletes an alert by changing the active boolean to false

exports.deleteAlert = function(req, res){
    index = req.body.index;
    User.findOne({_id:req.user._id}, function(err, u){
        if(err) res.redirect('/');
        u.alerts[index].active = false;
        u.save(function(err, u){
            if(err) console.log(err);
            console.log(u.alerts[index]);
            res.send("OK");
        });
    })
}

//updating the user profile when a user 

//exports.

