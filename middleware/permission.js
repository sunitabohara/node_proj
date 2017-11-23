/**
 * Created by sunita on 11/15/22.
 */
var Group = require("../models/group");


module.exports =  function  HasRole(role) {
    return HasRole[role] || (HasRole[role] = function(req, res, next) {
            Group.find({_id:req.session.user.group},{roles:1},function(err,result){
                if(!err){
                    var roles = result[0].roles;
                    if(roles.indexOf(role) > -1){
                        return next();
                    }

                   else {
                        req.flash("error", "Access Denied.");
                        return res.redirect(req.originalUrl);
                    }
                }else{
                    req.flash("error", err.message);
                    console.log(err);
                    return res.redirect(req.originalUrl);
                }
            });
        })
}
