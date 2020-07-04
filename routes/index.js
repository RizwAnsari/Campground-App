var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', function(req, res) {
	res.render('landing');
});

router.get('/registration', function(req, res) {
	res.render('register');
});

router.post('/registration', function(req, res) {
	User.register(new User({ username: req.body.username }), req.body.password, function(error, user) {
		if (error) {
			// console.log(error.message);
			req.flash('error', error.message);
			return res.redirect('/registration');
		}
		passport.authenticate('local')(req, res, function() {
			req.flash('success', 'You registered successfully as ' + user.username);
			res.redirect('/campgrounds');
		});
	});
});

router.get('/login', function(req, res) {
	res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		successFlash: 'Welcome back to YelpCamp',
		failureRedirect: '/login',
		failureFlash: true
	}),
	function(req, res) {}
);

router.get('/logout', function(req, res) {
	req.logOut();
	req.flash('success', 'Logged you out successfully.');
	res.redirect('/campgrounds');
});

router.get('*', function(req, res) {
	res.send('404 Page not found');
});

module.exports = router;
