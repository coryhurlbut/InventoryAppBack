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
    }
});

//Gets all active users
router.get('/active', verify, async (req, res, next) => {
    try {
        const users = await User.find().where({status: 'active'});
        res.json(users);
    } catch (err) {
        err.message = "Could not get active users";
        err.status = 500;
        err.instance = `/users/active`;
        next(err);
    }
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
    }
});
//the modified create user route for new site visitors to request an account
router.post('/new', async (req, res, next) => {
    //validate input data
    const {error} = registerValidation(req.body);
    if (error != undefined) {
        error.message = error.details[0].message;
        error.status = 400;
        next(error);
        return;
    }

    //check if user exists  something is wrong with this, getting this code when i do not submit duplicate
    const userExists = await User.find().where({userName: req.body.userName});
    if (userExists.length !== 0) {
        let err = new Error();
        err.message = 'User already exists. Please try again with a differnt userName.';
        err.status = 400;
        next(err);
        return;
    }

    const user = new User({
        firstName:      req.body.firstName,
        lastName:       req.body.lastName,
        userName:       req.body.userName,
        password:       '',
        userRole:       req.body.userRole.toLowerCase(),
        phoneNumber:    req.body.phoneNumber,
        status:         req.body.status
    });

    //save new user
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    }
    catch (err) {
        err.message = "Could not save user";
        err.status = 400;
        err.instance = `/users/new`;
        next(err);
    }
})

//Creates a User
router.post('/', verify, async (req, res, next) => {
    let password = '';

    //validate input data
    const {error} = registerValidation(req.body);
    if (error != undefined) {
        error.message = error.details[0].message;
        error.status = 400;
        next(error);
        return;
    }

    //check if user exists  something is wrong with this, getting this code when i do not submit duplicate
    const userExists = await User.find().where({userName: req.body.userName});
    if (userExists.length !== 0) {
        let err = new Error();
        err.message = 'User already exists. Please try again with a differnt userName.';
        err.status = 400;
        next(err);
        return;
    }

    if (req.body.password !== '') {
        //hash password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(req.body.password, salt);
    }   
    
    //create new user
    const user = new User({
        firstName:      req.body.firstName,
        lastName:       req.body.lastName,
        userName:       req.body.userName,
        password:       password,
        userRole:       req.body.userRole.toLowerCase(),
        phoneNumber:    req.body.phoneNumber,
        status:         req.body.status
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
    }
});

//Deletes a User. Input is JSON array of IDs
router.delete('/delete', verify, async (req, res, next) => {
    try {
        let userIds = [];
        req.body.forEach(userId => {
            userIds.push(userId)
            if (req.user.user.user._id === userId) {
                throw req.user.user.user;
            }
        });
        
        const removedUsers = await User.deleteMany({_id: { $in: req.body} });
        res.json(removedUsers);
    } catch (err) { 
        err.message = `Could not delete user ${err._id}`;
        err.status = 400;
        err.instance = `/users/delete`;
        next(err);
    }
});

//activates user accounts
router.patch('/activate', verify, async (req, res, next) => {
    try {
        const deactivatedUsers = await User.updateMany(
            {_id: { $in: req.body} },
            { status: 'active' }
        );

        res.json(deactivatedUsers);
    } catch (err) {
        err.message = "Could not activate users";
        err.status = 400;
        err.instance = `/users/activate`;
        next(err);
    }
});

//deactivates user accounts
router.patch('/deactivate', verify, async (req, res, next) => {
    try {
        req.body.forEach(userId => {
            if (req.user.user.user._id === userId) {
                throw req.user.user.user;
            }
        });

        const deactivatedUsers = await User.updateMany(
            {_id: { $in: req.body} },
            { status: 'inactive' }
        );

        res.json(deactivatedUsers);
    } catch (err) {
        err.message = "Could not deactivate users";
        err.status = 400;
        err.instance = `/users/deactivate`;
        next(err);
    }
});

//Updates a user
router.patch('/:id', verify, async (req, res, next) => {
    try {
        let user = {};
        if (req.body.hasPassword && req.body.password === '') {
            user = {
                firstName:      req.body.firstName,
                lastName:       req.body.lastName,
                userName:       req.body.userName,
                userRole:       req.body.userRole.toLowerCase(),
                phoneNumber:    req.body.phoneNumber,
                status:         req.body.status
            }
        } else {
            user = {
                firstName:      req.body.firstName,
                lastName:       req.body.lastName,
                userName:       req.body.userName,
                password:       req.body.password,
                userRole:       req.body.userRole.toLowerCase(),
                phoneNumber:    req.body.phoneNumber,
                status:         req.body.status
            }
        }
        
        //validate input data
        const {error} = registerValidation(user);
        if (error != undefined) {
            error.message = error.details[0].message;
            error.status = 400;
            next(error);
            return;
        }

        if (req.body.password !== '') {
            //hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await User.updateOne(
            { _id: req.params.id },
            {...user}
        );

        res.json(updatedUser);
    } catch (err) {
        err.message = "Could not edit user";
        err.status = 400;
        err.instance = `/users/${req.params.id}`;
        next(err);
    }
});

module.exports = router;