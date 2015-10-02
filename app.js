
//Module dependencies to be used within the application
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');


//This section goes to the controller directory which requires the js file containing functions to be used within the application. 
var homeController = require('./controllers/home');
var employersController = require('./controllers/employers');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');



//This sections sets and requires variables from the config folder which sets up authentication and IDs, keys and scope.
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

//Creates an app object which has methods for Routing HTTP request, configuring middleware, rendering
//HTML views and registering a template engine.
var app = express();

//Rewrite and read Little Mongo DB Book
//Make connection from config/secrets.js to connect MongoDB
mongoose.connect(secrets.db);
mongoose.set('debug', true);
// mongoose.connection.on('error', function() {
//   console.log('MongoDB Connection Error. Please make sure that MongoDB is running.'.red);
//   process.exit(1);
// });


//Express imports the framework into your app. path is a core Node working with and handling paths such as 
//the path.join which normalize all arguments into a path string so that you can use /file
app.set('views', path.join(__dirname, 'views'));

//Allows us to render jade in our application
app.set('view engine', 'jade');

//Adding compression to use middleware which will attempt to compress response bodies using a filter called filter(req,res) which 
//return a true of false value in deciding to compress
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'expanded'
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));

//This means that the user object will only be valid for the lifetime of the request
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});


app.use(function(req, res, next) {
  if (/api/i.test(req.path)) req.session.returnTo = req.path;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


//Setting up Routes to be used with the application
app.get('/', homeController.index);

//Setting up application to go to the employers path. The accessing the searchController to
//go inside of the search.js which exports 
//In this route, I rendered the api callback second to ensure it reached the next() to display employer page
app.get('/employers', passportConf.isAuthenticated, apiController.getLinkedin, employersController.getCompanySearch);
// app.post('/employers', passportConf.isAuthenticated, apiController.getLinkedin);
app.get('/techsearch', passportConf.isAuthenticated, apiController.getLinkedin, employersController.getCompanySearch);

app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
//Makes a request to render a user sign up page
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);



//Oauth Sign-In routes

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});


app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});



//Error Handler
app.use(errorHandler());

app.listen(process.env.PORT || 3000, function () {
  console.log("Starting a server on localhost:3000");
  
});
module.exports = app;
