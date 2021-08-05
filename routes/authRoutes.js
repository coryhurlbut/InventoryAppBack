const router            = require('express').Router();
const User              = require('../models/User');
const bcrypt            = require('bcryptjs');
const jwt               = require('jsonwebtoken');
const verify            = require('./verifyToken');
const {loginValidation} = require('../validation');

let refreshTokens = [];

router.post('/refresh', (req, res) => {
    console.log('hit')
    const refreshToken = req.body.refreshToken;
    console.log('refresh', req.body)
    if (refreshToken == null) return res.status(401).send('No Token');
    if (!refreshTokens.includes(refreshToken)) return res.status(403).send('No matching token');

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken(user);
        console.log(user.user)
        res.json({accessToken: accessToken, refreshToken: refreshToken, user: user.user});
    });
});

router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken);
    res.sendStatus(204);
});

router.post('/login', async (req, res) => {
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
    
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign({user: user}, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken, user: user});
});

function generateAccessToken(user) {
    return jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '180s' });
};

module.exports = router;