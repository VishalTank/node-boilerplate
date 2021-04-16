const router = require('express').Router();

const { validate } = require('../models/user.model');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', authValidation.logout, authController.logout);
