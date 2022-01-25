const express                   = require('express');
const router                    = express.Router();
const User                      = require('../models/User');
const bcrypt                    = require('bcryptjs');
const verify                    = require('./verifyToken');
const { registerValidation }    = require('../validation');

//Gets all users
router.get('/', verify, async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        err.message = "Could not get users";
        err.status = 500;
        err.instance = `/users/`;
        next(err);
    };
});

//Gets user by id
router.get('/:id', verify, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        err.message = "Could not get user";
        err.status = 400;
        err.instance = `/users/${req.params.id}`;
        next(err);
    };
});

//Creates a User
router.post('/', verify, async (req, res, next) => {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    //validate input data
    const {error} = registerValidation(req.body);
    if (error != undefined) {
        error.message = error.details[0].message;
        error.status = 400;
        next(error);
        return;
    };

    //check if user exists  something is wrong with this, getting this code when i do not submit duplicate
    const userExists = await User.find().where({firstName: req.body.firstName}).where({ lastName: req.body.lastName });
    if (userExists.length !== 0) {
        let err = new Error();
        err.message = 'User already exists';
        err.status = 400;
        next(err);
        return;
    };
    
    //create new user
    const user = new User({
        firstName:      req.body.firstName,
        lastName:       req.body.lastName,
        userName:       req.body.userName,
        password:       hashedPassword,
        userRole:       req.body.userRole,
        phoneNumber:    req.body.phoneNumber
    });

    //save new user
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    }
    catch (err) {
        err.message = "Could not save user";
        err.status = 400;
        err.instance = `/users/`;
        next(err);
    };
});

//Deletes a User
router.delete('/:id', verify, async (req, res, next) => {
    try {
        const removedUser = await User.deleteOne({_id: req.params.id});
        res.json(removedUser);
    } catch (err) { 
        err.message = "Could not save item";
        err.status = 400;
        err.instance = `/users/${req.params.id}`;
        next(err);
    };
});

//Updates a user
router.patch('/:id', verify, async (req, res, next) => {
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.id },
            {   
                firstName:      req.body.firstName,
                lastName:       req.body.lastName,
                userName:       req.body.userName,
                password:       req.body.password,
                userRole:       req.body.userRole,
                phoneNumber:    req.body.phoneNumber
            }
        );
        res.json(updatedUser);
    } catch (err) {
        err.message = "Could not edit user";
        err.status = 400;
        err.instance = `/users/${req.params.id}`;
        next(err);
    };
});

module.exports = router;