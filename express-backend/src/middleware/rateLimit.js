const rateLimit = require('express-rate-limit');
const request = require('request');


const tryLater = (req, res, next, options) => {
    return res.json({ status: "failure", message: 'Try after some time', data: null });
}


const limiterOneMin = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 5, // Limit each IP to 5 requests per `window` (here, per 1 minute)
    standardHeaders: true,
    legacyHeaders: false, 
    handler: tryLater
});

const limiterOneHour = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 60 requests per `window` (here, per 1 hour)
    standardHeaders: true, 
    legacyHeaders: false, 
    handler: tryLater
});

const limiterOneDay = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 100, // Limit each IP to 200 requests per `window` (here, per 1 day)
    standardHeaders: true, 
    legacyHeaders: false, 
    handler: tryLater
});

module.exports = {
    limiterOneMin,
    limiterOneHour,
    limiterOneDay
};