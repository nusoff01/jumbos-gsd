var User = require('../models/user.js');


/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.renderProfile = function(req, res){
  User.findOne({_id:req.user._id}).populate('inventory').exec(function(err, u) {
    if (!u || err) {
      console.log(err);
      res.send(404);
    } else {
      console.log(u);
      res.render('profile.ejs', {user: u});
    }
  });
};

