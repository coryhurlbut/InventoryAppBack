const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    serialNumber: {
        type: String
    },
    homeLocation: {
        type: String
    },
    specificLocation: {
        type: String
    },
    notes: {
        type: String
    },
    available: {
        type: Boolean
    },
    servicable: {
        type: Boolean
    }
});

//params for mongoose.model() = ('name of model', 'mongoose schema assigned to model', 'name of table associated with model')
module.exports = mongoose.model('Item', ItemSchema, 'Items');