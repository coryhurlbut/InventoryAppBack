const mongoose = require('mongoose');

const AdminLogSchema = mongoose.Schema({
    itemId: {
        type: String
    },
    userId: {
        type: String
    },
    adminId: {
        type: String,
        required: true
    },
    action: {//add, edit, delete
        type: String,
        required: true
    },
    content: {//user or item
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//params for mongoose.model() = ('name of model', 'mongoose schema assigned to model', 'name of table associated with model')
module.exports = mongoose.model('AdminLog', AdminLogSchema, 'AdminLog');