const mongoose = require('mongoose');

const ItemLogSchema = mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    custodianId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//params for mongoose.model() = ('name of model', 'mongoose schema assigned to model', 'name of table associated with model')
module.exports = mongoose.model('ItemLog', ItemLogSchema, 'ItemLog');