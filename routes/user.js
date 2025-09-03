const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const userController = require('../controllers/userController');

// Register form
router.get('/signup', userController.renderSignupForm);

// Signup logic
router.post('/signup', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        await User.register(user, password);
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/account'); // Redirect to profile page after signup
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }
});

// Login form
router.get('/login', userController.renderLoginForm);

// Login logic
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    res.redirect('/account'); // Redirect to profile page after login
});

// Logout
router.get('/logout', userController.logout);

// Account page
router.get('/account', userController.account);

module.exports = router;