var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middlewareFunctions = {};

middlewareFunctions.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You need to be logged in to do that.');
	res.redirect('/login');
};

middlewareFunctions.checkCommentOwner = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comid, function(error, foundComment) {
			if (error) {
				req.flash('error', 'Comment not found.');
				req.redirect('back');
			} else {
				if (foundComment) {
					if (foundComment.author.id.equals(req.user._id)) {
						return next();
					}
				} else {
					req.flash('error', "You don't have permission to do that.");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', "You don't have permission to do that.");
		res.redirect('back');
	}
};

middlewareFunctions['checkCampgroundOwner'] = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				req.flash('error', 'Campground not found.');
				res.redirect('back');
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', "You don't have permission to do that.");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that.');
		res.redirect('back');
	}
};

module.exports = middlewareFunctions;
