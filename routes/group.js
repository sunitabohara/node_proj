/**
 * Created by sunita on 11/20/17.
 */
var express = require('express');
var router = express.Router();
var Group = require("../models/group");
var Roles = require("../models/roles");
var LoginCheck = require("../middleware/loginCheck");
router.use(LoginCheck);
var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');
var Roles = require("../models/roles");
var arrayDiff =require("simple-array-diff");
router.get('/roles',function(req,res,next){
 
    Roles.aggregate(
        [
            { $group : { _id : "$section", Roles: { $push: "$$ROOT" } } }
        ],function (err,results) {

            if(!err){
               console.log(results);
                req.results=results;
                // return res.send(results);
                return res.render('group/roles',{results:results});
            }else{
                console.log(err);
                return res.send(err.message);
            }
        }
    );


});

router.get('/roles/insert',function(req,res,next){
    console.log('roles insert');
    res.send('roles insert');return;
    try {
        var roles = yaml.safeLoad(fs.readFileSync(path.join(__dirname,'/../uploads/roles/user.yml'), 'utf8'));
        var dbRoles ={};
        Roles.insertMany( roles);
        Roles.find({ }, function(err, results){
            if(err) {
                console.log(err);
            }
            else {
                dbRoles = results;
                //console.log(results)
            }
            // else res.send(results);
        });
        // var difference = arrayDiff(dbRoles,roles);
        // console.log(dbRoles);
        // console.log(difference);
        res.send(dbRoles);
    } catch (e) {
        console.log(e);
    }


    next()
});

router.get('/', function(req, res, next) {
    console.log('group');
    Group.find({},function(err,results){
        if(!err){
           // return res.send(results);
           return  res.render('group/index',{results:results});
        }else{
            req.flash('error',err.errmsg);
            return res.redirect('/group');
            // return res.send(err);
        }
    });
});
router.get('/new', function(req, res, next) {
    // res.send('new user');
    return  res.render('group/new');
});

router.post('/new', function(req, res, next) {
    // res.send(req.body);
    var data = new Group({
        name:req.body.name,
        description:req.body.description,
        status: req.body.status,
        // roles:{0:"addUser",1:"editUser"}
    });
    data.save(function (err,results) {
        if(err){
            console.log(err);
            req.flash('error',err.errmsg);
            return res.redirect('/group/new');
        }else{
            req.flash('success','Group added successfully.');
            return res.redirect('/group');
        }
    });

});

router.get('/:name/assign-roles',function (req,res,next) {
    Roles.aggregate(
        [
            { $group : { _id : "$section", Roles: { $push: "$$ROOT" } } }
        ],function (err,results) {

            if(!err){
                console.log(results);
                req.results=results;
                // return res.send(results);
                return res.render('group/assign_roles',{results:results,group:req.params.name});
            }else{
                console.log(err);
                return res.send(err.message);
            }
        }
    );
});

router.post('/:name/assign-roles',function (req,res,next) {
    Group.updateOne({
        "name": req.params.name
    }, {
        $set: {
            "roles": req.body.roles
        }
    }, function(err, results) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect('/'+req.params.name+'/assign-roles/');
        }
        else{
            req.flash("success", "Permissions has been assigned sucessfully to group "+req.params.name);
            return res.redirect('/group');
        }
    });
})
router.get('/:name/edit',function(req,res,next){
    Group.find({name:req.params.name},function(err,result){
        if(!err){
            return res.render('group/edit',{result:result,name:req.params.name});
        }else{
            req.flash("error", err.message);
            return res.redirect('/group');
        }
    });
});
router.post('/:name/edit',function(req,res,next){
    Group.updateOne({name:req.params.name},{$set:req.body},function(err,result){
        if(!err){
            req.flash("success", req.params.name +" has been update successfully.");
            return res.redirect('/group');

        }else{
            req.flash("error", err.message);
            return res.redirect('/group');
        }
    });
});



module.exports = router;