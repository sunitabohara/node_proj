/**
 * Created by sunita on 11/15/17.
 */

module.exports = function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        req.flash("success", "Login Success" )
        return next();
    } else {
        console.log(err)
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        // return next(err);
        req.flash("error", "Please Login first" )
        return res.redirect('/login');
    }
}

