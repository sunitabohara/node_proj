var express = require('express');
var router = express.Router();
var Address = require("../models/address");
var LoginCheck = require("../middleware/loginCheck");
router.use(LoginCheck);
router.get('/', function(req, res, next) {
     Address.find({

    }, function(err, results){
         if(err) console.log(err);
        else res.render('address/index', { results: results });
        // else res.send(results);
    });

});

router.get('/new', function(req, res, next) {
    // res.send('new user');
    res.render('address/new');
});

router.post('/new',function (req,res,next) {
    var data = new Address({
        state: req.body.state,
        district: req.body.district,
        address: req.body.address
    });
    data.save(function(err, result){
        if(err) {
            req.flash('error',err.errmsg);
            console.log(err);
         res.redirect('/address/new');
        }
        else {
            req.flash('success','Address has been added succesfully');
            res.redirect('/address');
        }
    });

})
router.get('/edit/:state', function(req, res, next) {
    Address.find({
        state:req.params.state
    }, function(err, result){
        if(err) {
            req.flash('error',err.errmsg);
            console.log(err);
            return res.redirect('/address')
        }
        else res.render('address/edit',{result:result});
    });
});
router.post('/edit/:state', function(req, res, next) {

    Address.updateOne({
        "state": req.params.state
    }, {
        $set: {
            "district": req.body.district,
            "address": req.body.address,
        }
    }, function(err, results) {
        if(err) {
            req.flash("error", err);
            return res.redirect('/address/edit/'+req.params.state);
        }
        else{
            req.flash("success", req.params.state+" Has been updated sucessfully");
            return res.redirect('/address');
        }
        console.log(results.result);
    });

});
module.exports = router;