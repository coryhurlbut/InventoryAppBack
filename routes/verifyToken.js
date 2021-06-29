const jwt   = require('jsonwebtoken');
const User  = require('../models/User');

/*
*   To be put into any route call. Will verify if the request has correct token.
*/
module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    };
};