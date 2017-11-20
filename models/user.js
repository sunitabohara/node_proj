/**
 * Created by sunita on 11/14/17.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
Schema = mongoose.Schema;
var UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
    },
    country: {
        type: String,
    },
    address: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true,
    },
   /* address:{
        type: Schema.Types.ObjectId,
         ref: 'addresses'
    }*/
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
});

UserSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({ username: username })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                console.log('unauthorized');
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
}
//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});
var User = mongoose.model('User',UserSchema);
module.exports = User;
