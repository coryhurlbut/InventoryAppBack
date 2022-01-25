const jwt   = require('jsonwebtoken');
const User  = require('../models/User');

/*
*   To be put into any route call. Will verify if the request has correct token.
*/
module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === undefined) {
        let err = new Error();
        err.message = "No token sent";
        err.status = 401;
        next(err);
    };

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            err.message = "Invalid token";
            err.status = 403;
            next(err);
        };
        req.user = user;
        next();
    });
};