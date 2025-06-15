require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const configureExpress = require('./config/express');
const { notFoundHandler, errorHandler } = require('./utils/errorHandler');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');      
console.log('Models after User import (initial):', mongoose.modelNames());


// Import routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require('./routes/user.js');

// Configure Express
configureExpress(app);

const sessionOption = {
    secret: process.env.SESSION_SECRET || "Supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    name: 'sessionId' // Custom name to avoid conflicts
}

// Apply session middleware directly
app.use(session(sessionOption));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

// Google OAuth Strategy - Commented out until credentials are set up
/*
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
async function(accessToken, refreshToken, profile, cb) {
    try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value
            });
        }
        
        return cb(null, user);
    } catch (err) {
        return cb(err, null);
    }
}));
*/

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make currentUser available to all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    next();
});

// Store the returnTo URL in session
app.use((req, res, next) => {
    if (!req.user && req.path !== '/login' && req.path !== '/signup') {
        req.session.returnTo = req.originalUrl;
    }
    next();
});

console.log('Models before router usage:', mongoose.modelNames());

// Routes
app.get('/', (req, res) => {
    res.render("listings/home.ejs");
});

// Google OAuth Routes - Commented out until credentials are set up
/*
app.get('/auth/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

app.get('/auth/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login',
        failureFlash: true
    }),
    (req, res) => {
        req.flash('success', 'Welcome to WanderLust!');
        const redirectUrl = req.session.returnTo || '/listings';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }
);
*/

app.get("/demouser",async (req,res)=>{
    let fakeUser = new User({
        email: "demo@gmail.com",
        username: "demo"
    })
    let newUser = await User.register(fakeUser,"nikhil@123");
    res.send(newUser);
})

// Use Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);


// Start server only after MongoDB connection
connectDB().then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
}); 