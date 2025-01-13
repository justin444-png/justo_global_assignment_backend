const router = require('express').Router();

const catchAsync = require('../utils/catchAsync');
const validate = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimit');
const verifyToken = require('../middleware/verifyToken');

const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login',rateLimiter.limiterOneMin,rateLimiter.limiterOneHour,rateLimiter.limiterOneDay, validate(authValidation.login), authController.login);
router.post('/generateLink/:userId', catchAsync(verifyToken), validate(authValidation.generateLink), authController.generteOneTimeLink);
router.get('/verifyLink/:link', catchAsync(verifyToken),validate(authValidation.verifyLink), authController.verifyLink);
router.get('/getServerTime/:userId',catchAsync(verifyToken),validate(authValidation.getServerTime), authController.getServerTime);
router.delete('/kickOutUser/:userId',validate(authValidation.getServerTime), authController.kickOutUser);


module.exports = router;