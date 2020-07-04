var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	seedDB = require('./seeds'),
	passport = require('passport'),
	passportLocal = require('passport-local'),
	expressSession = require('express-session'),
	methodOverride = require('method-override'),
	User = require('./models/user'),
	campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index'),
	flash = require('connect-flash');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'my secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	return next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comment', commentRoutes);
app.use('/', indexRoutes);

// mongoose.connect('mongodb://localhost:27017/YelpCamp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://newUser:newUser@yelp-camp-app.q2zfg.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// seedDB();

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('YelpCamp server started');
});
