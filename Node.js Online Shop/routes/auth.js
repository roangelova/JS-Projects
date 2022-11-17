const path = require('path');

const express = require('express');

const { body, check } = require('express-validator')

const authController = require('../controllers/auth');

const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/reset', authController.postReset);

router.post('/login', authController.postLogin);

router.post('/signup', [
    check('email').isEmail().withMessage('Please provide a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject('This email is already taken!')
                    }
                })
        })
    ,
    check('password', 'This is the default passwod error message').isLength({ min: 5, max: 100 }),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password and confirm password must match!");
        }
        return true;
    })
], authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;