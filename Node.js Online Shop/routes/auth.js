const path = require('path');

const express = require('express');

const { check } = require('express-validator/check')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/reset', authController.postReset);

router.post('/login', authController.postLogin);

router.post('/signup', check('email').isEmail(), authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;