/**
 * Created by sunita on 11/20/17.
 */
const mongoose = require('mongoose');

Schema = mongoose.Schema;
const group = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    roles: {
        type: []
    }
    /*roles: [{
     type: Schema.Types.ObjectId,
     ref: 'Roles'
     }],*/
});

module.exports = mongoose.model('Group', group);
