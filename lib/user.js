var User = require('../models/user.js');
var Listing = require('../models/listing.js');
var Book = require('../models/book.js');


/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.renderProfile = function(req, res){
  User.findOne({_id:req.user._id}).populate('inventory').exec(function(err, u) {
    //console.log("Name: " + u.inventory[0].book.name);
    Listing.find({seller: req.user.userName}).populate('book').exec(function(err, inventory){
      u.inventory = inventory;
      if (!u || err) {
        console.log(err);
        res.send(404);
      } else {
         res.render('profile.ejs', {user: u});
      }
    });
  });
};

