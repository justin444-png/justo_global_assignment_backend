const TokenModel = require('../models/token.model');

const verifyToken = async(req, res, next) => {

    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const token = await TokenModel.verifyToken(bearerToken);
        if (token) {
            req.userId = token.userId;
            next();
        } else {
            res.sendStatus(403);
        }

    } else {
        // Forbidden
        res.sendStatus(403);
    }

};

module.exports = verifyToken;