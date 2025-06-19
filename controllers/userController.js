const User = require('../models/user');

exports.renderSignupForm = (req, res) => {
    res.render('users/signup');
};

exports.signup = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/listings');
    }
};

exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/listings';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/listings');
    });
};

exports.account = (req, res) => {
    if (!req.user) {
        req.flash('error', 'Please login to view your account');
        return res.redirect('/login');
    }
    res.render('users/account', { user: req.user });
}; 