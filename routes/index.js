// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
// module.exports = router;
var express = require('express');
var passport = require('passport');
var router = express.Router();

var Address = require("../models/address");
var User = require("../models/user");
var Group = require("../models/group");
var LoginCheck = require("../middleware/loginCheck");
var promise = require('promise');
// router.use(LoginCheck);
router.get('/', LoginCheck,function (req, res) {
   res.render('index', { title :'hello ejs' });
});

router.get('/register', function(req, res,next) {

  Group.find({
  }, function(err, result){
    if(err) {
      req.flash('error',err.errmsg);
      console.log(err);
      return res.redirect('/address')
    }
    res.group=result;
    next()
   // res.render('register', {address:result });
  });

},function(req,res,next){
  Address.find({
  }, function(err, result){
    if(err) {
      req.flash('error',err.errmsg);
      console.log(err);
      return res.redirect('/address')
    }
    res.address=result;
    next()
   // res.render('register', {address:result ,group:res.group});
  });
},function (req,res) {
  res.render('register', {address:res.address ,group:res.group});
});
router.get('/register1', function(req, res) {

  var address  = {};
  Address.find({
  }, function(err, result){
    if(err) {
      req.flash('error',err.errmsg);
      console.log(err);
      return res.redirect('/address')
    }
    address=result;
    res.render('register', {address:result });
  });
});
router.post('/register', function(req, res) {
// res.send(req.body);return
  console.log(req.body.address);
  var data = new User({
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email,
    address: req.body.address,
    password: req.body.password,
    passwordConf: req.body.passwordConf,
    address: req.body.address.trim(),
    group: req.body.group.trim()
  });

  data.save(function (err, result){
    if(err) {
      req.flash('error',err.errmsg);
      console.log(err);
      return res.redirect('/register');
    }
    else {
      req.flash("success", data.username+" has been created successfully" );
      return res.redirect('/users');
    }
  // else console.log(result);
});


});

router.get('/login', function(req, res) {
  // console.log(req.session.authenticated);
  res.render('login', { user : req.user });
});

router.post('/login',function (req,res,next) {
  if(req.body.username && req.body.password){
    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.user = user;
        req.session.authenticated = true;
        return res.redirect('/');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    console.log('fail');
    return next(err);
  }

});

router.get('/logout', function(req, res) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
  return res.redirect('/');
});


module.exports = router;