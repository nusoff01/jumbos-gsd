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

    //console.log("Name: " + u.inventory[0].book.name);
    Listing.find({seller: req.user.userName}).populate('book').exec(function(err, inventory){
      u.inventory = inventory;

      //populate transactions?

      Transaction.find({buyer: req.user.userName}).populate('listing').exec(function(err, transactions){
        Listing.find({}).populate('u.transactions.listing').exec(function(err, listing){
          u.transactions = transactions;
          if (!u || err) {
            console.log(err);
            res.send(404);
          } else {
            console.log(u);
            res.render('profile.ejs', {user: u});
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

