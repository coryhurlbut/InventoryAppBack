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
        type: String
        //not required for profiles but required for custodians and admins

    },
    password: {
        type: String
        //not required for profiles but required for custodians and admins
        //encrypted/hashed
    },
    userRole: {
        type: String
    },
    phoneNumber: {
        type: String
    }
});

//params for mongoose.model() = ('name of model', 'mongoose schema assigned to model', 'name of table associated with model')
module.exports = mongoose.model('User', UserSchema, 'Users');