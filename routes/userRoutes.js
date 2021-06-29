const express                   = require('express');
const router                    = express.Router();
const User                      = require('../models/User');
const bcrypt                    = require('bcryptjs');
const verify                    = require('./verifyToken');
const { registerValidation }    = require('../validation');


//Gets all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({ message: err.message});
    };
});

//Gets user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.json({ message: err});
    };
    
});

//Creates a User
router.post('/', async (req, res) => {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //validate input data
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user exists
    const userExists = await User.findOne({firstName: req.body.firstName, lastName: req.body.lastName});
    if (userExists) return res.status(400).send('User already exists');
    
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
        res.json({ message: err });
    };
});

//Deletes a User
router.delete('/:id', async (req, res) => {
    try {
        const removedUser = await User.deleteOne({_id: req.params.id});
        res.json(removedUser);
    } catch (err) { 
        res.json({ message: err });
    };
});

//Updates a user
router.patch('/:id', async (req, res) => {
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
        res.json({ message: err });
    };
});

module.exports = router;