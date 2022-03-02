const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true

    },
    password: {
        type: String,
        default: ''
        //not required for profiles but required for custodians and admins
        //encrypted/hashed
    },
    userRole: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
});

//params for mongoose.model() = ('name of model', 'mongoose schema assigned to model', 'name of table associated with model')
module.exports = mongoose.model('User', UserSchema, 'Users');