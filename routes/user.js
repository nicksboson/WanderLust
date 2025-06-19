const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const userController = require('../controllers/userController');

// Register form
router.get('/signup', userController.renderSignupForm);

// Signup logic
router.post('/signup', wrapAsync(userController.signup));

// Login form
router.get('/login', userController.renderLoginForm);

// Login logic
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), userController.login);

// Logout
router.get('/logout', userController.logout);

// Account page
router.get('/account', userController.account);

module.exports = router;