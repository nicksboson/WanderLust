const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');

// Register form
router.get('/signup', (req, res) => {
    res.render('users/signup');
});

// Signup logic
router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/listings');
    }
}));

// Login form
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Login logic
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/listings';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/listings');
    });
});

// Account page
router.get('/account', (req, res) => {
    if (!req.user) {
        req.flash('error', 'Please login to view your account');
        return res.redirect('/login');
    }
    res.render('users/account', { user: req.user });
});

module.exports = router;