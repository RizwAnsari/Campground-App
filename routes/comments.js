var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware/middleware');

router.get('/new', middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(error, foundCamp) {
		if (error) {
			// console.log(error);
			req.flash('error', 'Something went wrong.');
			res.redirect('/campgrounds');
		} else {
			// res.render('comments/new', { camp: foundCamp });
			res.render('./comments/new', { camp: foundCamp });
		}
	});
});

router.post('/', middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(error, foundCamp) {
		if (error) {
			// console.log(error);
			req.flash('error', 'Something went wrong.');
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, function(error, createdComment) {
				if (error) {
					// console.log(error);
					req.flash('error', 'Something went wrong.');
				} else {
					createdComment.author.id = req.user._id;
					createdComment.author.username = req.user.username;
					createdComment.save();
					foundCamp.comments.push(createdComment);
					foundCamp.save(function(error, savedCamp) {
						if (error) {
							// console.log(error);
							req.flash('error', 'Something went wrong.');
						} else {
							req.flash('success', 'Comment added successfully.');
							res.redirect('/campgrounds/' + foundCamp._id);
							// console.log(savedCamp);
						}
					});
				}
			});
		}
	});
});

router.get('/:comid/edit', middleware.checkCommentOwner, function(req, res) {
	Comment.findById(req.params.comid, function(error, foundComment) {
		if (error) {
			req.flash('error', 'Comment not found.');
			// res.redirect('back');
			res.redirect('/campgrounds');
		} else {
			res.render('./comments/edit.ejs', { camp_id: req.params.id, comment: foundComment });
		}
	});
});

router.put('/:comid', middleware.checkCommentOwner, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comid, req.body.edit, { useFindAndModify: false }, function(
		error,
		updatedComment
	) {
		if (error) {
			// console.log(error);
			req.flash('error', 'Something went wrong.');
			res.redirect('/campgrounds/' + req.params.id);
		} else {
			req.flash('success', 'Comment edited succesfully.');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});
router.delete('/:comid', middleware.checkCommentOwner, function(req, res) {
	Comment.findByIdAndDelete(req.params.comid, function(error) {
		if (error) {
			// console.log(error);
			req.flash('error', 'Something went wrong.');
			res.redirect('/campgrounds/' + req.params.id);
		} else {
			req.flash('success', 'Comment deleted successfully.');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;
