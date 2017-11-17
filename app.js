var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var db = mongoose.connection;

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var address = require('./routes/address');
var users = require('./routes/users');
var account = require('./models/account');
var app = express();


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/testDB' , {useMongoClient: true}, function(err, done){
    if(err){
        console.log(err);
    }else{
        console.log('----------Connected-------------');
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));


//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));
app.use(flash());

//for flash message
app.use(function(req, res, next) {
    res.locals.flashMsg ={
        success : req.flash('success'),
        error : req.flash('error'),
        info : req.flash('info'),
    };
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/address', address);


// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//passport
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
));
module.exports = app;
