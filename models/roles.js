/**
 * Created by sunita on 11/20/17.
 */
const mongoose = require('mongoose');

const roles = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Roles', roles);
