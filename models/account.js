/**
 * Created by sunita on 11/10/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    address: String,
    state: String,
    district: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
