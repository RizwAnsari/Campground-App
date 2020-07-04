var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware/middleware');

router.get('/', function(req, res) {
	Campground.find({}, function(error, Campgrounds) {
		if (!error) {
			// console.log(req.user);
			res.render('./campgrounds/index', { camps: Campgrounds });
		} else {
			console.log(error);
		}
	});
});

router.post('/', middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author = { id: req.user._id, username: req.user.username };
	var newCampGround = { name: name, image: image, price: price, description: description, author: author };
	Campground.create(newCampGround, function(error, addedCampground) {
		if (!error) {
			req.flash('success', 'Campground added successfully.');
			res.redirect('/campgrounds');
		} else {
			req.flash('error', 'Something went wrong.');
			// console.log(error);
		}
	});
});

router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('./campgrounds/new');
});

router.get('/:id', function(req, res) {
	var id = req.params.id;
	Campground.findById(id).populate('comments').exec(function(error, showCamp) {
		if (!error) {
			// console.log(showCamp);
			res.render('./campgrounds/show', { camp: showCamp });
		} else {
			// console.log(error);
			req.flash('error', 'Campground not found.');
			res.redirect('/campgrounds');
		}
	});
});

router.get('/:id/edit', middleware.checkCampgroundOwner, function(req, res) {
	Campground.findById(req.params.id, function(error, foundCamp) {
		if (error) {
			// console.log(error);
			req.flash('error', 'Campground not found.');
			res.redirect('/campgrounds');
		} else {
			res.render('./campgrounds/edit', { camp: foundCamp });
		}
	});
});

router.put('/:id', middleware.checkCampgroundOwner, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.edit, { new: true, useFindAndModify: false }, function(
		error,
		updatedCamp
	) {
		if (error) {
			req.flash('error', 'Something went wrong.');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Campground edited successfully.');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

router.delete('/:id', middleware.checkCampgroundOwner, function(req, res) {
	Campground.findByIdAndDelete(req.params.id, function(error, removedCamp) {
		if (error) {
			// res.redirect('/campgrounds/' + req.params.id);
			req.flash('error', 'Something went wrong.');
			res.redirect('/campgrounds');
		} else {
			removedCamp.comments.forEach(function(delComment) {
				Comment.findByIdAndDelete(delComment._id, function(error) {
					if (error) {
						res.redirect('/campgrounds/' + req.params.id);
					}
				});
			});
			req.flash('success', 'Campground deleted successfully.');
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;
