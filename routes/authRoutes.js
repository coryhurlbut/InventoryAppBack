const router            = require('express').Router();
const User              = require('../models/User');
const bcrypt            = require('bcryptjs');
const jwt               = require('jsonwebtoken');
const verify            = require('./verifyToken');
const {loginValidation} = require('../validation');

let refreshTokens = [];

function generateAccessToken(user) {
    return jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' });
};

router.post('/refresh', (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken === "undefined") {
        let err = new Error();
        err.message = "No token";
        err.status = 401;
        next(err);
        return;
    };

    if (!refreshTokens.includes(refreshToken)) {
        let err = new Error();
        err.message = "No matching token";
        err.status = 403;
        next(err);
        return;
    };

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            err.message = "Verification Error";
            err.status = 403;
            next(err);
            return;
        };

        const accessToken = generateAccessToken(user);
        res.json({accessToken: accessToken, user: user.user});
    });
});

router.delete('/logout', (req, res, next) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken);
    res.sendStatus(204);
});

router.post('/login', async (req, res, next) => {
    //Validate input data
    const {error} = loginValidation(req.body);
    if (error) {
        error.message = error.details[0].message;
        error.status = 400;
        next(error);
        return;
    };

    //Check if user exists
    const user = await User.findOne({userName: req.body.userName});
    if (user === null) {
        let err = new Error();
        err.message = "Username is incorrect";
        err.status = 400;
        next(err);
        return;
    };

    //Check if password is correct
    let validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword)  {
        let err = new Error();
        err.message = "Password is incorrect";
        err.status = 400;
        next(err);
        return;
    };

    //Create and assign a token
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign({user: user}, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken, user: user});
});

module.exports = router;