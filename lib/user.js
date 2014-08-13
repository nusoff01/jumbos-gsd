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

    //u = renderTrans(u);
    uName = req.user.userName;
    //console.log("Name: " + u.inventory[0].book.name);
    Listing.find({ $and: [{seller: uName}, {status : 'available'}]}).populate('book').exec(function(err, inventory){
      u.inventory = inventory;

      //populate transactions?
      //
      //Transaction.find({}).populate('u.transactions.listing').exec(function(err, transactions){
      Transaction.find({ $or: [{seller: uName}, {buyer: uName}]}).populate('listing').exec(function(err, t){ 
        //t = transactions;
        Listing.populate(t, {path: 'listing.book', model: 'Book'}, function(err, t){ //.exec(function(err, listings){

          u.transactions = t;
          console.log("trans1: " + u.transactions[0].listing); 
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

