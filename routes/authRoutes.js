const router            = require('express').Router();
const User              = require('../models/User');
const bcrypt            = require('bcryptjs');
const jwt               = require('jsonwebtoken');
const verify            = require('./verifyToken');
const {loginValidation} = require('../validation');

router.post('/login', async (req, res) => {
    console.log('hit')
    //Validate input data
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if user exists
    const user = await User.findOne({userName: req.body.userName});
    if (!user) return res.status(400).send('Username is incorrect');

    //Check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;