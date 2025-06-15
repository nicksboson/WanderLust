const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const helmet = require('helmet');

function configureExpress(app) {
    // Security middleware
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    }));

    // Middleware setup
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(express.json());

    // Make currentUser available to all views
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        next();
    });

    // View engine setup
    app.engine('ejs', ejsMate);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
}

module.exports = configureExpress; 