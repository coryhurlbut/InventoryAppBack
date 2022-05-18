const router            = require('express').Router();
const User              = require('../models/User');
const bcrypt            = require('bcryptjs');
const jwt               = require('jsonwebtoken');
const verify            = require('./verifyToken');
const {loginValidation} = require('../validation');

let refreshTokens = [];
let loginAttempts = 0;
const MAX_LOGIN_ATTEMPTS = 3;
const MAX_LOGIN_TIMEOUT = 900000    // minutes * 60 * 1000

//TODO: refactor {user: user} to only be user
function generateAccessToken(user) {
    return jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' });
};

router.post('/refresh', (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken === "undefined") {
        let err = new Error();
        err.message = "No token";
        err.status = 401;
        next(err);
        return;
    }

    if (!refreshTokens.includes(refreshToken)) {
        let err = new Error();
        err.message = "No matching token";
        err.status = 403;
        next(err);
        return;
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            err.message = "Verification Error";
            err.status = 403;
            next(err);
            return;
        }

        const accessToken = generateAccessToken(user);
        res.json({accessToken: accessToken, user: user.user});
    });
});

router.delete('/logout', (req, res, next) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken);
    res.sendStatus(204);
});

//Sets timer to prevent brute force attacks, 15 minutes
function clearLoginAttemptTimer(){
    setTimeout(() => 
        {loginAttempts = 0}, 
        MAX_LOGIN_TIMEOUT
    );
}

function checkMaxLoginAttempt(err) {
    //pass error message up to log in to disable login modal
    if(loginAttempts > MAX_LOGIN_ATTEMPTS) {
        clearLoginAttemptTimer();

        err.message = "Max Login Attemp Exceeded. Please try again later.";
        err.status = 400;

        return true;
    }
    return false;
}

router.post('/login', async (req, res, next) => {
    let err = new Error();
    loginAttempts = 1;

    //Check if user exists
    await User.findOne({userName: req.body.userName})
    .then((user) => {
        if(user === null) {
            if(!checkMaxLoginAttempt(err)) {
                err.message = "Username is incorrect";
                err.status = 400;
            }

            next(err);
            return;
        }

        //Check if password is correct
        let validPassword = bcrypt.compareSync(req.body.password, user.password);
        if(!validPassword) {
            if(!checkMaxLoginAttempt(err)) {
                err.message = "Password is incorrect";
                err.status = 400;
            }

            next(err);
            return;
        }

        //Checks if the user's account is activated or not
        if(user.status !== 'active') {
            if(!checkMaxLoginAttempt(err)) {
                err.message = "User is not activated";
                err.status = 400;
            }

            next(err);
            return;
        }
        
        //Create and assign a token
        const accessToken = generateAccessToken(user);
        //TODO: get rid of {user: user} to simplify object structure
        const refreshToken = jwt.sign({user: user}, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        res.json({ accessToken: accessToken, refreshToken: refreshToken, user: user});

        //If user successfully logs in, reset login attempts
        loginAttempts = 0;
    })
    .catch(async (errMess) => {  
        err.message = errMess.message;
        err.status = 400;
        next(err);
        return;         
    });
});

module.exports = router;