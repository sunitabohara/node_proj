const mongoose = require('mongoose');

const address = mongoose.Schema({
    state: {
        type: String,
        unique: true,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Address', address);