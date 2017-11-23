var express = require('express');
var router = express.Router();
var mysql = require('mysql')

var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');
var Roles = require("../models/roles");
var arrayDiff =require("simple-array-diff");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'sunita',
  database : 'symfony'
});

var LoginCheck = require("../middleware/loginCheck");
var Permission = require("../middleware/permission");
var User = require("../models/user");

connection.connect();
/* GET users listing. */
router.get('/',LoginCheck, function(req, res, next) {
  User.find({ })
      .populate('address').populate('group','name')
      .exec(function (err, results) {
        if (err) {
          console.log(err);
        }
        else {
         return res.render('users/index', { results:results });
        }
      })
});
router.get('/new', function(req, res, next) {

/*var role = new Roles({
  name:'createUser',
  description: 'creates user',
  section: 'User'
});
// Roles.insertMany( doc);
role.save(function (err,result) {
  if (err) console.log(err);
  else res.send(result);
});*/
  

});

router.post('/new',function (req,res) {
  var user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    status: req.body.status,
    section: req.body.section,
    slug: req.body.username,
  }
  connection.query('INSERT INTO s1_users SET ?', user, function (err, resp) {
    if (err) throw err;
    else res.redirect('/users');
  });

})
router.get('/edit/:id', function(req, res, next) {
  connection.query('SELECT * from s1_users where id='+req.params.id, function (error, results, fields) {
    if (error) throw error;
    else res.render('users/edit', { results: results });
  });
});
router.post('/edit/:id', function(req, res, next) {
  connection.query("UPDATE s1_users SET ? WHERE id='"+req.params.id+"'",req.body,function (err, resp) {
    if (err) throw err;
    res.redirect('/users');
  });
});

module.exports = router;

