const jwt   = require('jsonwebtoken');
const User  = require('../models/User');

/*
*   To be put into any route call. Will verify if the request has correct token.
*/
module.exports = function (req, res, next) {
    // const token = req.header('auth-token');
    // if (!token) return res.status(401).send('Access denied');

    // try {
    //     const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    //     req.user = verified;
    //     next();
    // } catch (error) {
    //     res.status(400).send('Invalid token');
    // };

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log('verifyToken', err, user);

        if (err) return res.sendStatus(403);

        if (user.exp < Date.now() / 1000) {
            return res.status(403).send({message: 'Token Expired'});
        };
        
        req.user = user;
        next();
    });
};