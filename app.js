require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ejs = require('ejs');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");
const helmet = require('helmet');

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Middleware setup
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());

// View engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
const MONGO_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/wanderlust';

// Validate MongoDB ID
const isValidId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

// MongoDB connection error handling
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
    }
});

// Routes
app.get('/', (req, res) => {
    res.send("Welcome to Wanderlust!");
});

// Index route
app.get('/listings', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('./listings/index.ejs', { listings });
}));

// New listing form
app.get('/listings/new', (req, res) => {
    res.render('./listings/new.ejs');
});

// Create new listing
const validateListing = function(req, res, next) {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.message);
    }
    next();
};

app.post('/listings', validateListing, wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect(`/listings`);
}));

// Show listing
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, 'Listing not found');
    }
    res.render('./listings/show.ejs', { listing });
}));

// Edit form
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, 'Listing not found');
    }
    res.render('./listings/edit.ejs', { listing });
}));

// Update listing
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { 
        new: true,
        runValidators: true
    });
    if (!updatedListing) {
        throw new ExpressError(404, 'Listing not found');
    }
    res.redirect(`/listings/${updatedListing._id}`);
}));

// Delete listing
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new ExpressError(404, 'Listing not found');
    }
    res.redirect('/listings');
}));

// 404 handler - must be after all other routes
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
});

// Error handling middleware - must be after 404 handler
app.use((err, req, res, next) => {
    console.error(err);
    let { status = 500, message = "Something went wrong" } = err;
    
    // Handle Joi validation errors
    if (err.isJoi) {
        status = 400;
        message = err.details.map(detail => detail.message).join(', ');
    }
    
    // Handle MongoDB errors
    if (err.name === 'CastError') {
        status = 400;
        message = 'Invalid ID format';
    }
    
    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
        status = 400;
        message = 'Duplicate field value entered';
    }

    // Handle MongoDB connection errors
    if (err.name === 'MongoServerError') {
        status = 500;
        message = 'Database error occurred';
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    res.status(status).render('error', { err: { status, message } });
});

// Start server only after MongoDB connection
main().then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
}); 