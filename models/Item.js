const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    itemNumber: {
        type: String,
        required: true,
        distinct: true
    },
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    serialNumber: {
        type: String,
        required: true
    },
    homeLocation: {
        type: String,
        required: true
    },
    specificLocation: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    possessedBy: {
        type: String
    }
});

//params for mongoose.model() = ('name of model', 'mongoose schema assigned to model', 'name of table associated with model')
module.exports = mongoose.model('Item', ItemSchema, 'Items');